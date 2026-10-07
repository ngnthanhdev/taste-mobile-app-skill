// One movement: ink type tag, SKU name with mono code, signed quantity, time. Pushes the movement detail.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { formatSigned, formatTime, movementLabel, type Movement } from '../data/stock';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export function MovementRow({ movement, showCode = true }: { movement: Movement; showCode?: boolean }) {
  const c = useTheme();
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/movement/[id]', params: { id: movement.id } })}
      accessibilityRole="button"
      android_ripple={{ color: c.divider }}
      style={[styles.row, movement.undone && styles.undone]}
    >
      <View style={[styles.tag, { backgroundColor: c.text }]}>
        <Text style={[styles.tagText, { color: c.surface }]}>{movementLabel[movement.type]}</Text>
      </View>
      <View style={styles.text}>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{movement.skuName}</Text>
        <Text style={[styles.meta, { color: c.textMuted }]} numberOfLines={1}>
          {showCode ? <Text style={styles.mono}>{movement.skuCode}</Text> : null}
          {showCode && (movement.supplier || movement.reference || movement.reason) ? ' · ' : ''}
          {movement.supplier ?? movement.reference ?? movement.reason ?? ''}
          {movement.undone ? ' · đã hoàn tác' : ''}
        </Text>
      </View>
      <Text style={[styles.delta, { color: c.text }]}>{formatSigned(movement.delta)}</Text>
      <Text style={[styles.time, { color: c.textMuted }]}>{formatTime(movement.at)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.s12, paddingHorizontal: spacing.s16 },
  undone: { opacity: 0.4 },
  tag: { minWidth: 56, paddingHorizontal: spacing.s8, paddingVertical: spacing.s4, alignItems: 'center' },
  tagText: { ...type.caption, fontWeight: '700', letterSpacing: 1 },
  text: { flex: 1, gap: 2 },
  name: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500' },
  meta: { ...type.caption, fontFamily: fontFamily.ui },
  mono: { fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  delta: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  time: { ...type.caption, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'], minWidth: 40, textAlign: 'right' },
});
