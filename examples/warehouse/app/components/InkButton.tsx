// The primary action: an ink block, 0 radius, one per screen. variant="outlined" for secondary actions.
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { fontFamily, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'ink' | 'outlined';
  disabled?: boolean;
  loading?: boolean;
};

export function InkButton({ label, onPress, variant = 'ink', disabled = false, loading = false }: Props) {
  const c = useTheme();
  const ink = variant === 'ink';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      android_ripple={{ color: ink ? c.textMuted : c.divider }}
      style={({ pressed }) => [
        styles.button,
        ink ? { backgroundColor: c.accent } : { borderWidth: 2, borderColor: c.text, backgroundColor: c.surface },
        { opacity: disabled ? 0.4 : pressed ? 0.85 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={ink ? c.onAccent : c.text} />
      ) : (
        <Text style={[styles.label, { color: ink ? c.onAccent : c.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: touch.min + spacing.s8,
    paddingHorizontal: spacing.s24,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  label: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '700' },
});
