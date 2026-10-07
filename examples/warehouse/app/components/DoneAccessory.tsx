// iOS number pads have no return key, so every numeric input gets a Done bar attached to the keyboard itself
// [R-KB7]. Being part of the keyboard frame, it never overlaps a keyboard-sticky footer. Android pads have Done.
import React from 'react';
import { InputAccessoryView, Keyboard, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { fontFamily, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export const DONE_ACCESSORY_ID = 'done';

export function DoneAccessory() {
  const c = useTheme();
  if (Platform.OS !== 'ios') return null;
  return (
    <InputAccessoryView nativeID={DONE_ACCESSORY_ID} backgroundColor={c.surfaceAlt}>
      <View style={[styles.bar, { borderTopColor: c.divider }]}>
        <Pressable onPress={Keyboard.dismiss} accessibilityRole="button" hitSlop={8} style={styles.button}>
          <Text style={[styles.label, { color: c.text }]}>Xong</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: spacing.s8, borderTopWidth: StyleSheet.hairlineWidth },
  button: { minHeight: touch.min - spacing.s4, paddingHorizontal: spacing.s12, justifyContent: 'center' },
  label: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600' },
});
