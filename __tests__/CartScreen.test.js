import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import CartScreen from '../pages/CartScreen';
import { STORAGE_KEYS } from '../context/AppContext';
import {
  renderWithAppProvider,
  seedMockStorage,
  waitForAppHydration,
} from '../test-utils/renderWithAppProvider';

jest.mock('@react-native-async-storage/async-storage');

describe('CartScreen', () => {
  const navigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    AsyncStorage.__resetMockStorage();
    jest.clearAllMocks();
    jest.spyOn(Math, 'random').mockReturnValue(0.42);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('groups repeated items and calculates the total from global state', async () => {
    seedMockStorage({
      [STORAGE_KEYS.cartItems]: JSON.stringify([
        { id: 4, name: 'coxinha', price: 'R$ 8,00', image: 1 },
        { id: 4, name: 'coxinha', price: 'R$ 8,00', image: 1 },
        { id: 3, name: 'cachorro quente', price: 'R$ 10,00', image: 2 },
      ]),
    });

    renderWithAppProvider(<CartScreen navigation={navigation} />);
    await waitForAppHydration();

    expect(screen.getByText('coxinha')).toBeTruthy();
    expect(screen.getByText('x2')).toBeTruthy();
    expect(screen.getByText('cachorro quente')).toBeTruthy();
    expect(screen.getByText('PAGAR R$ 26,00')).toBeTruthy();
  });

  test('keeps checkout disabled when the cart is empty', async () => {
    renderWithAppProvider(<CartScreen navigation={navigation} />);
    await waitForAppHydration();

    expect(screen.getByText('Carrinho vazio')).toBeTruthy();
    fireEvent.press(screen.getByText('PAGAR R$ 0,00'));

    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  test('removes a line item and completes the order with a persisted pickup code', async () => {
    seedMockStorage({
      [STORAGE_KEYS.cartItems]: JSON.stringify([
        { id: 4, name: 'coxinha', price: 'R$ 8,00', image: 1 },
        { id: 3, name: 'cachorro quente', price: 'R$ 10,00', image: 2 },
      ]),
    });

    renderWithAppProvider(<CartScreen navigation={navigation} />);
    await waitForAppHydration();

    fireEvent.press(screen.getByText('Remover coxinha'));

    await waitFor(() => {
      expect(screen.queryByText('coxinha')).toBeNull();
    });

    fireEvent.press(screen.getByText('PAGAR R$ 10,00'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('PickupCode');
    });

    expect(JSON.parse(AsyncStorage.__getMockStorage()[STORAGE_KEYS.cartItems])).toEqual([]);
    expect(JSON.parse(AsyncStorage.__getMockStorage()[STORAGE_KEYS.lastPickupCode])).toBe('42');
  });
});
