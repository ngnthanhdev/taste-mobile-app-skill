// The label block: the object, shown as the thing it is. Name, mono code, barcode, on-hand, low-stock tag.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Sku } from '../data/stock';
import { formatQuantity } from '../data/stock';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Barcode } from './Barcode';

export function SkuLabel({ sku }: { sku: Sku }) {
  const c = useTheme();
  const low = sku.onHand < sku.minimum;
  return (
    <View style={[styles.block, { borderColor: c.text }]}>
      <View style={styles.row}>
        <Text style={[styles.name, { color: c.text }]} numberOfLines={2}>{sku.name}</Text>
        {low ? (
          <View style={[styles.tag, { backgroundColor: c.warn }]}>
            <Text style={[styles.tagText, { color: c.text }]}>TỒN THẤP</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.code, { color: c.textMuted }]}>{sku.code} · {sku.location}</Text>
      <View style={styles.barcode}>
        <Barcode value={sku.code} height={40} color={c.text} />
      </View>
      <Text style={[styles.onHand, { color: c.text }]}>
        Tồn {formatQuantity(sku.onHand)} {sku.unit}
        <Text style={{ color: c.textMuted }}> · tối thiểu {formatQuantity(sku.minimum)}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { borderWidth: 2, padding: spacing.s12, gap: spacing.s8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.s8 },
  name: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600', flex: 1 },
  code: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  barcode: { paddingVertical: spacing.s4 },
  onHand: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  tag: { paddingHorizontal: spacing.s8, paddingVertical: spacing.s4 },
  tagText: { ...type.caption, fontWeight: '700', letterSpacing: 1 },
});
