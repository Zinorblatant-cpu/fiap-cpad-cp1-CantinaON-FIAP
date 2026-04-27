import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from './components/LoadingScreen.js';
import { AppProvider, useAppContext } from './context/AppContext.js';
import CartScreen from './pages/CartScreen.js';
import LoginScreen from './pages/LoginScreen.js';
import MenuScreen from './pages/MenuScreen.js';
import PickupCodeScreen from './pages/PickupCodeScreen.js';
import RegisterScreen from './pages/RegisterScreen.js';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { isHydrated } = useAppContext();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PickupCode"
          component={PickupCodeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
