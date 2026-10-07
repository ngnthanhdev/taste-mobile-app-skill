// Kho: List. Search, then 56 dp rows: name, mono code, quantity right, yellow left bar when below minimum.
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Chip } from '../../components/Chip';
import { InkBar } from '../../components/InkBar';
import { formatQuantity, listSkus, useStock, type Sku } from '../../data/stock';
import { fontFamily, radius, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function StockScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const all = listSkus();
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((s) => (!lowOnly || s.onHand < s.minimum) && (!q || s.name.toLowerCase().includes(q) || s.code.includes(q)));
  }, [all, query, lowOnly]);

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar label="Kho" count={`${all.length} SKU`} />
      <View style={styles.tools}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm tên hoặc mã SKU"
          placeholderTextColor={c.textMuted}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Tìm SKU"
          style={[styles.search, { backgroundColor: c.surfaceAlt, color: c.text, borderBottomColor: c.textMuted }]}
        />
        <View style={styles.chips}>
          <Chip label="Tồn thấp" selected={lowOnly} onPress={() => setLowOnly((v) => !v)} />
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(s) => s.code}
        renderItem={({ item }) => <SkuRow sku={item} onPress={() => router.push({ pathname: '/receive', params: { code: item.code } })} />}
        ItemSeparatorComponent={() => <View style={[styles.divider, { backgroundColor: c.divider }]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: c.textMuted }]}>
              {lowOnly ? 'Không có SKU nào dưới mức tối thiểu.' : `Không có SKU nào khớp "${query}".`}
            </Text>
            {lowOnly ? <Chip label="Bỏ lọc" onPress={() => setLowOnly(false)} /> : null}
          </View>
        }
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
    </View>
  );
}

function SkuRow({ sku, onPress }: { sku: Sku; onPress: () => void }) {
  const c = useTheme();
  const low = sku.onHand < sku.minimum;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" android_ripple={{ color: c.divider }} style={styles.row}>
      <View style={[styles.stripe, { backgroundColor: low ? c.warn : 'transparent' }]} />
      <View style={styles.rowText}>
        <Text style={[styles.rowName, { color: c.text }]} numberOfLines={1}>{sku.name}</Text>
        <Text style={[styles.rowCode, { color: c.textMuted }]}>{sku.code} · {sku.location}</Text>
      </View>
      <Text style={[styles.rowQty, { color: c.text }]}>{formatQuantity(sku.onHand)} <Text style={[styles.rowUnit, { color: c.textMuted }]}>{sku.unit}</Text></Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  tools: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12, gap: spacing.s12 },
  search: { ...type.bodyLg, fontFamily: fontFamily.ui, height: 52, paddingHorizontal: spacing.s16, borderBottomWidth: 1, borderTopLeftRadius: radius.field, borderTopRightRadius: radius.field },
  chips: { flexDirection: 'row', gap: spacing.s8, paddingBottom: spacing.s4 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingRight: spacing.s16 },
  stripe: { width: spacing.s4, alignSelf: 'stretch', marginRight: spacing.s12 },
  rowText: { flex: 1, gap: 2 },
  rowName: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500' },
  rowCode: { ...type.caption, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowQty: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowUnit: { ...type.caption, fontFamily: fontFamily.ui },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: spacing.s16 },
  empty: { paddingHorizontal: spacing.s16, paddingVertical: spacing.s24, gap: spacing.s12, alignItems: 'flex-start' },
  emptyText: { ...type.body, fontFamily: fontFamily.ui },
});
