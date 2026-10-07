// Status bar for screens whose top is the surface, not the ink bar. The ink bar sets its own; the last mounted wins.
import React from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export function SurfaceStatusBar() {
  const dark = useColorScheme() === 'dark';
  return <StatusBar style={dark ? 'light' : 'dark'} />;
}
