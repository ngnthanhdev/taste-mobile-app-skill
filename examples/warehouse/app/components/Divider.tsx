import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function Divider({ inset = true }: { inset?: boolean }) {
  const c = useTheme();
  return <View style={[styles.line, { backgroundColor: c.divider, marginLeft: inset ? spacing.s16 : 0 }]} />;
}

const styles = StyleSheet.create({ line: { height: StyleSheet.hairlineWidth } });
