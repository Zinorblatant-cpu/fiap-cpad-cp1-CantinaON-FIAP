import React from 'react';
import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import PickupCodeScreen from '../pages/PickupCodeScreen';
import { DEFAULT_MOCK_USER, STORAGE_KEYS, useAppContext } from '../context/AppContext';
import {
  renderWithAppProvider,
  seedMockStorage,
  waitForAppHydration,
} from '../test-utils/renderWithAppProvider';

jest.mock('@react-native-async-storage/async-storage');

function AuthenticatedPickupCodeScreen({ navigation }) {
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

  return <PickupCodeScreen navigation={navigation} />;
}

describe('PickupCodeScreen', () => {
  const navigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    AsyncStorage.__resetMockStorage();
    jest.clearAllMocks();
  });

  test('shows the persisted pickup code and the runtime user guidance', async () => {
    seedMockStorage({
      [STORAGE_KEYS.lastPickupCode]: JSON.stringify('42'),
    });

    renderWithAppProvider(<AuthenticatedPickupCodeScreen navigation={navigation} />);
    await waitForAppHydration();

    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText(/Aguarde a chamada do seu codigo/i)).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText(new RegExp(DEFAULT_MOCK_USER.fullName, 'i'))).toBeTruthy();
    });
  });

  test('navigates back to the menu screen', async () => {
    seedMockStorage({
      [STORAGE_KEYS.lastPickupCode]: JSON.stringify('42'),
    });

    renderWithAppProvider(<PickupCodeScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.press(screen.getByText('NOVO PEDIDO'));

    expect(navigation.navigate).toHaveBeenCalledWith('Menu');
  });
});
