import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useSession } from '../data/session';
import { colors, fontFamily, type } from '../theme/tokens';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = colors[scheme];
  const session = useSession();
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: c.surface },
            headerStyle: { backgroundColor: c.surface },
            headerShadowVisible: false,
            headerTintColor: c.text,
            headerTitleStyle: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600' },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Protected guard={!session}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={Boolean(session)}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="receive" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="issue" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="(count)" options={{ presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="sku/[code]" />
            <Stack.Screen name="location/[id]" />
            <Stack.Screen name="movement/[id]" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="adjust" options={{ presentation: 'formSheet', headerShown: false, sheetAllowedDetents: [0.7], sheetGrabberVisible: true }} />
            <Stack.Screen name="history-filter" options={{ presentation: 'formSheet', headerShown: false, sheetAllowedDetents: [0.5], sheetGrabberVisible: true }} />
          </Stack.Protected>
        </Stack>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
