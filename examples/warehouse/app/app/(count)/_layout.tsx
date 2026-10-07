// Kiểm kê is a three-step full-screen group: pick a location, count each SKU, review the differences.
import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../theme/useTheme';

export default function CountLayout() {
  const c = useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.surface } }} />;
}
