import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export const STORAGE_KEYS = {
  cartItems: '@cantinaon/cart-items',
  lastPickupCode: '@cantinaon/last-pickup-code',
};

export const DEFAULT_MOCK_USER = {
  id: 'mock-user-1',
  fullName: 'Usuario Generico',
  email: 'generico@email.com',
  password: 'senha12345',
};

const AppContext = createContext(null);

function parseStoredValue(rawValue, fallbackValue) {
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

function createSessionUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  };
}

function createRuntimeUsers() {
  return [{ ...DEFAULT_MOCK_USER }];
}

export function AppProvider({ children }) {
  const [users, setUsers] = useState(createRuntimeUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [lastPickupCode, setLastPickupCode] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrateAppState = async () => {
      const [storedCartItems, storedPickupCode] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.cartItems),
        AsyncStorage.getItem(STORAGE_KEYS.lastPickupCode),
      ]);

      setCartItems(parseStoredValue(storedCartItems, []));
      setLastPickupCode(parseStoredValue(storedPickupCode, null));
      setIsHydrated(true);
    };

    void hydrateAppState();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void AsyncStorage.setItem(STORAGE_KEYS.cartItems, JSON.stringify(cartItems));
  }, [cartItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (lastPickupCode) {
      void AsyncStorage.setItem(
        STORAGE_KEYS.lastPickupCode,
        JSON.stringify(lastPickupCode)
      );
      return;
    }

    void AsyncStorage.removeItem(STORAGE_KEYS.lastPickupCode);
  }, [isHydrated, lastPickupCode]);

  const registerUser = async ({ fullName, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const hasDuplicateEmail = users.some(
      (user) => user.email.toLowerCase() === normalizedEmail
    );

    if (hasDuplicateEmail) {
      return {
        success: false,
        error: 'EMAIL_ALREADY_REGISTERED',
      };
    }

    setUsers((currentUsers) => [
      ...currentUsers,
      {
        id: `user-${Date.now()}`,
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
      },
    ]);

    return { success: true };
  };

  const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const matchedUser = users.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail && user.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        error: 'INVALID_CREDENTIALS',
      };
    }

    const sessionUser = createSessionUser(matchedUser);
    setCurrentUser(sessionUser);

    return {
      success: true,
      user: sessionUser,
    };
  };

  const logoutUser = async () => {
    setCurrentUser(null);
    setCartItems([]);

    return { success: true };
  };

  const addItemToCart = (item) => {
    setCartItems((currentItems) => [...currentItems, item]);
  };

  const removeItemFromCart = (itemId) => {
    setCartItems((currentItems) => {
      const indexToRemove = currentItems.findIndex((item) => item.id === itemId);

      if (indexToRemove < 0) {
        return currentItems;
      }

      const nextItems = [...currentItems];
      nextItems.splice(indexToRemove, 1);
      return nextItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const completeOrder = async () => {
    if (cartItems.length === 0) {
      return {
        success: false,
        error: 'EMPTY_CART',
      };
    }

    const pickupCode = Math.floor(Math.random() * 100).toString();
    setLastPickupCode(pickupCode);
    setCartItems([]);

    return {
      success: true,
      pickupCode,
    };
  };

  const contextValue = useMemo(
    () => ({
      users,
      currentUser,
      cartItems,
      lastPickupCode,
      isHydrated,
      registerUser,
      loginUser,
      logoutUser,
      addItemToCart,
      removeItemFromCart,
      clearCart,
      completeOrder,
    }),
    [users, currentUser, cartItems, lastPickupCode, isHydrated]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider.');
  }

  return context;
}
