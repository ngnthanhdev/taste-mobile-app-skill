import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { colors } from '../theme/tokens';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = colors[scheme];
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <StatusBar style={scheme === 'dark' ? 'dark' : 'light'} />
        <Stack screenOptions={{ contentStyle: { backgroundColor: c.surface } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="receive" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
