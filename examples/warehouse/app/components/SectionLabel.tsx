// Uppercase caption label for a group of content. The only uppercase outside the ink bar and tags.
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function SectionLabel({ children, inset = false }: { children: string; inset?: boolean }) {
  const c = useTheme();
  return <Text style={[styles.label, inset && styles.inset, { color: c.textMuted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  inset: { paddingHorizontal: spacing.s16, paddingTop: spacing.s24, paddingBottom: spacing.s8 },
});
