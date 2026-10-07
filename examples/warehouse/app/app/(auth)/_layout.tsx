import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../theme/useTheme';

export default function AuthLayout() {
  const c = useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.surface } }} />;
}
