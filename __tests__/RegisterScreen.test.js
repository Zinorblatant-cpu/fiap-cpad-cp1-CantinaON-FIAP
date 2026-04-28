import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../pages/RegisterScreen';
import { DEFAULT_MOCK_USER } from '../context/AppContext';
import {
  renderWithAppProvider,
  waitForAppHydration,
} from '../test-utils/renderWithAppProvider';

jest.mock('@react-native-async-storage/async-storage');

describe('RegisterScreen', () => {
  const navigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    AsyncStorage.__resetMockStorage();
    jest.clearAllMocks();
  });

  test('validates required fields, e-mail format, and password rules', async () => {
    renderWithAppProvider(<RegisterScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.press(screen.getByText('CRIAR CONTA'));

    expect(screen.getByText('Informe o nome completo.')).toBeTruthy();
    expect(screen.getByText('Informe o e-mail.')).toBeTruthy();
    expect(screen.getByText('Informe a senha.')).toBeTruthy();
    expect(screen.getByText('Confirme a senha.')).toBeTruthy();

    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'Leonardo Oliveira');
    fireEvent.changeText(screen.getByPlaceholderText('E-mail'), 'email-invalido');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), '123');
    fireEvent.changeText(screen.getByPlaceholderText('Confirmacao de senha'), '456');
    fireEvent.press(screen.getByText('CRIAR CONTA'));

    expect(screen.getByText('Informe um e-mail valido.')).toBeTruthy();
    expect(screen.getByText('A senha deve ter no minimo 6 caracteres.')).toBeTruthy();
    expect(screen.getByText('A confirmacao deve ser identica a senha.')).toBeTruthy();
  });

  test('rejects duplicate e-mails from the seeded runtime mock user', async () => {
    renderWithAppProvider(<RegisterScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'Leonardo Oliveira');
    fireEvent.changeText(
      screen.getByPlaceholderText('E-mail'),
      DEFAULT_MOCK_USER.email
    );
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), '123456');
    fireEvent.changeText(screen.getByPlaceholderText('Confirmacao de senha'), '123456');
    fireEvent.press(screen.getByText('CRIAR CONTA'));

    await waitFor(() => {
      expect(screen.getByText('Ja existe uma conta com esse e-mail.')).toBeTruthy();
    });

    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  test('creates a runtime user, returns to login, and does not persist auth data', async () => {
    renderWithAppProvider(<RegisterScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'Leonardo Oliveira');
    fireEvent.changeText(screen.getByPlaceholderText('E-mail'), 'leonardo@fiap.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), '123456');
    fireEvent.changeText(screen.getByPlaceholderText('Confirmacao de senha'), '123456');
    fireEvent.press(screen.getByText('CRIAR CONTA'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('Login');
    });

    expect(AsyncStorage.__getMockStorage()['@cantinaon/users']).toBeUndefined();
    expect(AsyncStorage.__getMockStorage()['@cantinaon/current-user']).toBeUndefined();
  });
});
