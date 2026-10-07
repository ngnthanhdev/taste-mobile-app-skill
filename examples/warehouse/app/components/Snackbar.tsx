// Material snackbar: one line, one action, sits above the navigation bar inside the bottom inset.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { dismissSnack, useSnack } from '../data/snackbar';
import { fontFamily, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function Snackbar() {
  const snack = useSnack();
  const c = useTheme();
  if (!snack) return null;
  return (
    <View
      style={[styles.wrap, { bottom: spacing.s16 }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <View style={[styles.bar, { backgroundColor: c.text }]}>
        <Text style={[styles.message, { color: c.surface }]} numberOfLines={2}>{snack.message}</Text>
        {snack.actionLabel ? (
          <Pressable
            onPress={() => {
              snack.onAction?.();
              dismissSnack();
            }}
            accessibilityRole="button"
            hitSlop={8}
            style={styles.action}
          >
            <Text style={[styles.actionLabel, { color: c.warn }]}>{snack.actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: spacing.s16, right: spacing.s16 },
  bar: {
    minHeight: touch.min,
    paddingHorizontal: spacing.s16,
    borderRadius: radius.field,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s16,
  },
  message: { ...type.body, fontFamily: fontFamily.ui, flex: 1 },
  action: { minHeight: touch.min, justifyContent: 'center' },
  actionLabel: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '700' },
});
