import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AppProvider, useAppContext } from '../context/AppContext';

function HydrationProbe() {
  const { isHydrated } = useAppContext();
  return <Text testID="hydrated-state">{String(isHydrated)}</Text>;
}

export function renderWithAppProvider(ui) {
  return render(
    <AppProvider>
      <HydrationProbe />
      {ui}
    </AppProvider>
  );
}

export async function waitForAppHydration() {
  await waitFor(() => {
    expect(screen.getByTestId('hydrated-state').props.children).toBe('true');
  });
}

export function resetMockStorage() {
  AsyncStorage.__resetMockStorage();
}

export function seedMockStorage(values) {
  AsyncStorage.__seedMockStorage(values);
}

export function getMockStorage() {
  return AsyncStorage.__getMockStorage();
}
