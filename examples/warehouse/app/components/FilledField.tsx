// Material 3 filled text field with a persistent label and a field-specific error. Posture proof for Android-first.
import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { fontFamily, radius, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Props = TextInputProps & { label?: string; error?: string };

export const FilledField = forwardRef<TextInput, Props>(function FilledField({ label, error, style, ...rest }, ref) {
  const c = useTheme();
  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: error ? c.danger : c.textMuted }]}>{label}</Text> : null}
      <TextInput
        ref={ref}
        placeholderTextColor={c.textMuted}
        {...rest}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        style={[styles.field, { backgroundColor: c.surfaceAlt, color: c.text, borderBottomColor: error ? c.danger : c.textMuted, borderBottomWidth: error ? 2 : 1 }, style]}
      />
      {error ? <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="polite">{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.s4 },
  label: { ...type.caption, fontFamily: fontFamily.ui },
  field: { ...type.bodyLg, fontFamily: fontFamily.ui, height: 52, paddingHorizontal: spacing.s16, borderTopLeftRadius: radius.field, borderTopRightRadius: radius.field },
  error: { ...type.caption, fontFamily: fontFamily.ui },
});
