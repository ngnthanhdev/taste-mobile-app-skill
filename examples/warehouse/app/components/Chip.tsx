// Pill chip: quick values, properties, reasons. The only rounded shape in the app.
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { fontFamily, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Props = { label: string; selected?: boolean; onPress?: () => void; disabled?: boolean };

export function Chip({ label, selected = false, onPress, disabled = false }: Props) {
  const c = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      hitSlop={8}
      android_ripple={{ color: c.divider, borderless: false }}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: c.text, borderWidth: selected ? 2 : 1, backgroundColor: selected ? c.surfaceAlt : c.surface, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: c.text, fontWeight: selected ? '700' : '500' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: spacing.s32,
    minWidth: touch.min,
    paddingHorizontal: spacing.s12,
    borderWidth: 1,
    borderRadius: radius.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500' },
});
