import React from 'react';
import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import MenuScreen from '../pages/MenuScreen';
import { DEFAULT_MOCK_USER, STORAGE_KEYS, useAppContext } from '../context/AppContext';
import {
  renderWithAppProvider,
  seedMockStorage,
  waitForAppHydration,
} from '../test-utils/renderWithAppProvider';

jest.mock('@react-native-async-storage/async-storage');

function AuthenticatedMenuScreen({ navigation }) {
  const { currentUser, isHydrated, loginUser } = useAppContext();
  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (!isHydrated || currentUser || hasLoggedIn.current) {
      return;
    }

    hasLoggedIn.current = true;
    void loginUser({
      email: DEFAULT_MOCK_USER.email,
      password: DEFAULT_MOCK_USER.password,
    });
  }, [currentUser, isHydrated, loginUser]);

  return <MenuScreen navigation={navigation} />;
}

describe('MenuScreen', () => {
  const navigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    AsyncStorage.__resetMockStorage();
    jest.clearAllMocks();
  });

  test('renders the runtime user greeting and menu items', async () => {
    renderWithAppProvider(<AuthenticatedMenuScreen navigation={navigation} />);
    await waitForAppHydration();

    await waitFor(() => {
      expect(screen.getByText(new RegExp(DEFAULT_MOCK_USER.fullName, 'i'))).toBeTruthy();
    });

    expect(screen.getByText('pacoca')).toBeTruthy();
    expect(screen.getByText('pao de batata')).toBeTruthy();
    expect(screen.getByText('Adicionar coxinha')).toBeTruthy();
  });

  test('adds items to the global cart and updates the badge', async () => {
    renderWithAppProvider(<MenuScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.press(screen.getByText('Adicionar coxinha'));
    fireEvent.press(screen.getByText('Adicionar cachorro quente'));

    expect(screen.getByText('2')).toBeTruthy();
    expect(JSON.parse(AsyncStorage.__getMockStorage()[STORAGE_KEYS.cartItems])).toHaveLength(2);
  });

  test('navigates to the cart and supports logout', async () => {
    renderWithAppProvider(<AuthenticatedMenuScreen navigation={navigation} />);
    await waitForAppHydration();

    await waitFor(() => {
      expect(screen.getByText(new RegExp(DEFAULT_MOCK_USER.fullName, 'i'))).toBeTruthy();
    });

    fireEvent.press(screen.getByText('SAIR'));
    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('Login');
    });

    fireEvent.press(screen.getByText('Adicionar coxinha'));
    fireEvent.press(screen.getByText('🛒').parent);

    expect(navigation.navigate).toHaveBeenCalledWith('Cart');
  });
});
