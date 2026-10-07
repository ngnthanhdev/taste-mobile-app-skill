// One sentence of what belongs here and one action. Leading-aligned like the rest of the screen.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Chip } from './Chip';

type Props = { message: string; actionLabel?: string; onAction?: () => void };

export function EmptyState({ message, actionLabel, onAction }: Props) {
  const c = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { color: c.textMuted }]}>{message}</Text>
      {actionLabel && onAction ? <Chip label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.s16, paddingVertical: spacing.s24, gap: spacing.s12, alignItems: 'flex-start' },
  text: { ...type.body, fontFamily: fontFamily.ui },
});
