import React from 'react';
import { render, screen } from '@testing-library/react-native';

const mockRegisteredScreens = [];
const mockNavigatorProps = [];
const mockUseAppContext = jest.fn();

jest.mock('@react-navigation/native', () => {
  const React = require('react');

  return {
    NavigationContainer: ({ children }) => (
      <React.Fragment>{children}</React.Fragment>
    ),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');

  return {
    createNativeStackNavigator: () => ({
      Navigator: (props) => {
        mockNavigatorProps.push(props);
        return <React.Fragment>{props.children}</React.Fragment>;
      },
      Screen: (props) => {
        mockRegisteredScreens.push(props);
        return null;
      },
    }),
  };
});

jest.mock('../context/AppContext', () => ({
  AppProvider: ({ children }) => children,
  useAppContext: () => mockUseAppContext(),
}));

jest.mock('../pages/MenuScreen.js', () => 'MenuScreen', { virtual: true });
jest.mock('../pages/CartScreen.js', () => 'CartScreen', { virtual: true });
jest.mock('../pages/PickupCodeScreen.js', () => 'PickupCodeScreen', { virtual: true });
jest.mock('../pages/LoginScreen.js', () => 'LoginScreen', { virtual: true });
jest.mock('../pages/RegisterScreen.js', () => 'RegisterScreen', { virtual: true });

import App, { AppNavigator } from '../App';

describe('App navigation shell', () => {
  beforeEach(() => {
    mockRegisteredScreens.length = 0;
    mockNavigatorProps.length = 0;
    jest.clearAllMocks();
  });

  test('shows a loading state while runtime auth and local cart data are hydrating', () => {
    mockUseAppContext.mockReturnValue({
      isHydrated: false,
      currentUser: null,
    });

    render(<AppNavigator />);

    expect(screen.getByText('Carregando dados...')).toBeTruthy();
  });

  test('starts on login after hydration and registers all application routes', () => {
    mockUseAppContext.mockReturnValue({
      isHydrated: true,
      currentUser: null,
    });

    render(<AppNavigator />);

    expect(mockNavigatorProps[0].initialRouteName).toBe('Login');
    expect(mockRegisteredScreens.map((screen) => screen.name)).toEqual([
      'Login',
      'Register',
      'Menu',
      'Cart',
      'PickupCode',
    ]);
  });

  test('wraps the navigator with the application provider', () => {
    mockUseAppContext.mockReturnValue({
      isHydrated: false,
      currentUser: null,
    });

    expect(() => render(<App />)).not.toThrow();
  });
});
