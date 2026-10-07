// The signature and the top app bar: a full-bleed ink bar inside the top safe area, once per screen.
// Uppercase label left, one count right, optional leading (close/back) and trailing actions, 48 dp each.
import React from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { fontFamily, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Action = { icon: keyof typeof MaterialIcons.glyphMap; label: string; onPress: () => void };

type Props = { label: string; count?: string; leading?: Action; trailing?: Action[]; insetTop?: boolean };

export function InkBar({ label, count, leading, trailing = [], insetTop = true }: Props) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const dark = useColorScheme() === 'dark';
  const action = (a: Action) => (
    <Pressable
      key={a.label}
      onPress={a.onPress}
      accessibilityRole="button"
      accessibilityLabel={a.label}
      android_ripple={{ color: c.textMuted, borderless: true }}
      style={({ pressed }) => [styles.action, { opacity: pressed ? 0.7 : 1 }]}
    >
      <MaterialIcons name={a.icon} size={24} color={c.onAccent} />
    </Pressable>
  );
  return (
    <View style={[styles.wrap, { backgroundColor: c.accent, paddingTop: insetTop ? insets.top : 0 }]}>
      {insetTop ? <StatusBar style={dark ? 'dark' : 'light'} /> : null}
      <View style={styles.bar} accessibilityRole="header">
        {leading ? action(leading) : null}
        <Text style={[styles.label, { color: c.onAccent, marginLeft: leading ? 0 : spacing.s16 }]}>{label.toUpperCase()}</Text>
        <View style={styles.spacer} />
        {count ? <Text style={[styles.count, { color: c.onAccent, marginRight: trailing.length ? spacing.s8 : spacing.s16 }]}>{count}</Text> : null}
        {trailing.map(action)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  bar: { height: spacing.s48, flexDirection: 'row', alignItems: 'center' },
  action: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center' },
  label: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 1 },
  spacer: { flex: 1 },
  count: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
});
