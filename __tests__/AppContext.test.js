import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  AppProvider,
  DEFAULT_MOCK_USER,
  STORAGE_KEYS,
  useAppContext,
} from '../context/AppContext';

jest.mock('@react-native-async-storage/async-storage');

function ContextHarness() {
  const {
    isHydrated,
    users,
    currentUser,
    cartItems,
    lastPickupCode,
    registerUser,
    loginUser,
    logoutUser,
    addItemToCart,
    clearCart,
    completeOrder,
  } = useAppContext();
  const [lastResult, setLastResult] = useState('');

  const handleResult = async (action) => {
    const result = await action();
    setLastResult(JSON.stringify(result));
  };

  return (
    <View>
      <Text testID="hydrated">{String(isHydrated)}</Text>
      <Text testID="user-count">{String(users.length)}</Text>
      <Text testID="current-user">{currentUser?.email ?? 'none'}</Text>
      <Text testID="cart-count">{String(cartItems.length)}</Text>
      <Text testID="pickup-code">{lastPickupCode ?? 'none'}</Text>
      <Text testID="last-result">{lastResult}</Text>

      <TouchableOpacity
        onPress={() =>
          handleResult(() =>
            registerUser({
              fullName: 'Ana Souza',
              email: 'ana@fiap.com',
              password: '123456',
            })
          )
        }
      >
        <Text>register-runtime-user</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          handleResult(() =>
            registerUser({
              fullName: 'Ana Souza',
              email: 'ana@fiap.com',
              password: '123456',
            })
          )
        }
      >
        <Text>register-duplicate-user</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          handleResult(() =>
            loginUser({
              email: DEFAULT_MOCK_USER.email,
              password: DEFAULT_MOCK_USER.password,
            })
          )
        }
      >
        <Text>login-default-user</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          handleResult(() =>
            loginUser({
              email: 'ana@fiap.com',
              password: '123456',
            })
          )
        }
      >
        <Text>login-registered-user</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleResult(() => logoutUser())}>
        <Text>logout-user</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          handleResult(async () => {
            addItemToCart({
              id: 2,
              name: 'pao de batata',
              price: 'R$ 6,00',
              image: 1,
            });
            return { success: true };
          })
        }
      >
        <Text>add-to-cart</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleResult(() => completeOrder())}>
        <Text>complete-order</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleResult(async () => {
        clearCart();
        return { success: true };
      })}>
        <Text>clear-cart</Text>
      </TouchableOpacity>
    </View>
  );
}

describe('AppProvider', () => {
  beforeEach(() => {
    AsyncStorage.__resetMockStorage();
    jest.clearAllMocks();
    jest.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('hydrates persisted cart data while seeding the default runtime auth user', async () => {
    AsyncStorage.__seedMockStorage({
      [STORAGE_KEYS.cartItems]: JSON.stringify([
        { id: 4, name: 'coxinha', price: 'R$ 8,00', image: 1 },
      ]),
      [STORAGE_KEYS.lastPickupCode]: JSON.stringify('42'),
    });

    render(
      <AppProvider>
        <ContextHarness />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('hydrated').props.children).toBe('true');
    });

    expect(screen.getByTestId('user-count').props.children).toBe('1');
    expect(screen.getByTestId('current-user').props.children).toBe('none');
    expect(screen.getByTestId('cart-count').props.children).toBe('1');
    expect(screen.getByTestId('pickup-code').props.children).toBe('42');
  });

  test('registers a runtime user in memory, blocks duplicate e-mails, and avoids auth persistence', async () => {
    render(
      <AppProvider>
        <ContextHarness />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('hydrated').props.children).toBe('true');
    });

    fireEvent.press(screen.getByText('register-runtime-user'));

    await waitFor(() => {
      expect(screen.getByTestId('user-count').props.children).toBe('2');
    });

    fireEvent.press(screen.getByText('register-duplicate-user'));

    await waitFor(() => {
      expect(screen.getByTestId('last-result').props.children).toContain('EMAIL_ALREADY_REGISTERED');
    });

    expect(AsyncStorage.__getMockStorage()['@cantinaon/users']).toBeUndefined();
    expect(AsyncStorage.__getMockStorage()['@cantinaon/current-user']).toBeUndefined();
  });

  test('authenticates the seeded mock user and a runtime registration in the same execution', async () => {
    render(
      <AppProvider>
        <ContextHarness />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('hydrated').props.children).toBe('true');
    });

    fireEvent.press(screen.getByText('login-default-user'));

    await waitFor(() => {
      expect(screen.getByTestId('current-user').props.children).toBe(DEFAULT_MOCK_USER.email);
    });

    fireEvent.press(screen.getByText('logout-user'));

    await waitFor(() => {
      expect(screen.getByTestId('current-user').props.children).toBe('none');
    });

    fireEvent.press(screen.getByText('register-runtime-user'));

    await waitFor(() => {
      expect(screen.getByTestId('user-count').props.children).toBe('2');
    });

    fireEvent.press(screen.getByText('login-registered-user'));

    await waitFor(() => {
      expect(screen.getByTestId('current-user').props.children).toBe('ana@fiap.com');
    });

    expect(AsyncStorage.__getMockStorage()['@cantinaon/current-user']).toBeUndefined();
  });

  test('manages cart state globally and persists the generated pickup code', async () => {
    render(
      <AppProvider>
        <ContextHarness />
      </AppProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('hydrated').props.children).toBe('true');
    });

    fireEvent.press(screen.getByText('add-to-cart'));

    await waitFor(() => {
      expect(screen.getByTestId('cart-count').props.children).toBe('1');
    });

    fireEvent.press(screen.getByText('complete-order'));

    await waitFor(() => {
      expect(screen.getByTestId('pickup-code').props.children).toBe('42');
    });

    expect(screen.getByTestId('cart-count').props.children).toBe('0');
    expect(JSON.parse(AsyncStorage.__getMockStorage()[STORAGE_KEYS.lastPickupCode])).toBe('42');
  });
});
