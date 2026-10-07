// Kho: List. Search, then 56 dp rows: name, mono code, quantity right, yellow left bar when below minimum.
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Chip } from '../../components/Chip';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { FilledField } from '../../components/FilledField';
import { InkBar } from '../../components/InkBar';
import { Snackbar } from '../../components/Snackbar';
import { formatQuantity, listSkus, useStock, type Sku } from '../../data/stock';
import { fontFamily, spacing, type } from '../../theme/tokens';
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
      <InkBar label="Kho" count={`${all.length} SKU`} trailing={[{ icon: 'qr-code-scanner', label: 'Quét mã vạch', onPress: () => router.push('/scan') }]} />
      <View style={styles.tools}>
        <FilledField value={query} onChangeText={setQuery} placeholder="Tìm tên hoặc mã SKU" returnKeyType="search" clearButtonMode="while-editing" autoCorrect={false} accessibilityLabel="Tìm SKU" />
        <View style={styles.chips}>
          <Chip label="Tồn thấp" selected={lowOnly} onPress={() => setLowOnly((v) => !v)} />
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(s) => s.code}
        renderItem={({ item }) => <SkuRow sku={item} onPress={() => router.push({ pathname: '/sku/[code]', params: { code: item.code } })} />}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={
          lowOnly ? (
            <EmptyState message="Không có SKU nào dưới mức tối thiểu." actionLabel="Bỏ lọc" onAction={() => setLowOnly(false)} />
          ) : (
            <EmptyState message={all.length ? `Không có SKU nào khớp "${query}".` : 'Chưa có SKU. Nhập danh mục để bắt đầu.'} />
          )
        }
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
      <Snackbar />
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
  chips: { flexDirection: 'row', gap: spacing.s8, paddingBottom: spacing.s4 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingRight: spacing.s16 },
  stripe: { width: spacing.s4, alignSelf: 'stretch', marginRight: spacing.s12 },
  rowText: { flex: 1, gap: 2 },
  rowName: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500' },
  rowCode: { ...type.caption, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowQty: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowUnit: { ...type.caption, fontFamily: fontFamily.ui },
});
