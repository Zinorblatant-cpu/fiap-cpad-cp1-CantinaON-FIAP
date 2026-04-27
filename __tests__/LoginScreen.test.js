import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import LoginScreen from '../pages/LoginScreen';
import { DEFAULT_MOCK_USER } from '../context/AppContext';
import {
  renderWithAppProvider,
  waitForAppHydration,
} from '../test-utils/renderWithAppProvider';

jest.mock('@react-native-async-storage/async-storage');

describe('LoginScreen', () => {
  const navigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    AsyncStorage.__resetMockStorage();
    jest.clearAllMocks();
  });

  test('validates required fields and e-mail format', async () => {
    renderWithAppProvider(<LoginScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.press(screen.getByText('ENTRAR'));

    expect(screen.getByText('Informe o e-mail.')).toBeTruthy();
    expect(screen.getByText('Informe a senha.')).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('E-mail'), 'email-invalido');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), '123456');
    fireEvent.press(screen.getByText('ENTRAR'));

    expect(screen.getByText('Informe um e-mail valido.')).toBeTruthy();
    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  test('shows an authentication error for invalid runtime credentials', async () => {
    renderWithAppProvider(<LoginScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.changeText(
      screen.getByPlaceholderText('E-mail'),
      DEFAULT_MOCK_USER.email
    );
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), '999999');
    fireEvent.press(screen.getByText('ENTRAR'));

    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha incorretos.')).toBeTruthy();
    });

    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  test('authenticates the seeded mock user and navigates to the menu', async () => {
    renderWithAppProvider(<LoginScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.changeText(
      screen.getByPlaceholderText('E-mail'),
      DEFAULT_MOCK_USER.email
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Senha'),
      DEFAULT_MOCK_USER.password
    );
    fireEvent.press(screen.getByText('ENTRAR'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('Menu');
    });
  });
});
