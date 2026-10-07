// Vị trí: List. Mono location code as title, SKUs on this shelf, one action: count it.
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { InkButton } from '../../components/InkButton';
import { SurfaceStatusBar } from '../../components/SurfaceStatusBar';
import { formatQuantity, formatRelativeDay, getLocation, listSkusAt, useStock, type Sku } from '../../data/stock';
import { fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function LocationScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const location = getLocation(id);
  const skus = listSkusAt(id);

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <SurfaceStatusBar />
      <Stack.Screen options={{ title: id, headerTitleStyle: { fontFamily: fontFamily.mono } }} />
      <View style={styles.summary}>
        <Text style={[styles.zone, { color: c.text }]}>{location?.zone ?? 'Vị trí chưa có trong sơ đồ'}</Text>
        <Text style={[styles.meta, { color: c.textMuted }]}>{skus.length} SKU · {location?.lastCount ? `đếm ${formatRelativeDay(location.lastCount)}` : 'chưa kiểm kê'}</Text>
      </View>
      <FlatList
        data={skus}
        keyExtractor={(s) => s.code}
        renderItem={({ item }) => <SkuRow sku={item} onPress={() => router.push({ pathname: '/sku/[code]', params: { code: item.code } })} />}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={<EmptyState message="Kệ trống. Nhập hàng vào kệ này để bắt đầu theo dõi." actionLabel="Nhập vào kệ này" onAction={() => router.push('/receive')} />}
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.s16), borderTopColor: c.divider }]}>
        <InkButton label="Kiểm kê vị trí này" onPress={() => router.push({ pathname: '/(count)/location', params: { location: id } })} disabled={skus.length === 0} />
      </View>
    </View>
  );
}

function SkuRow({ sku, onPress }: { sku: Sku; onPress: () => void }) {
  const c = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" android_ripple={{ color: c.divider }} style={styles.row}>
      <View style={[styles.stripe, { backgroundColor: sku.onHand < sku.minimum ? c.warn : 'transparent' }]} />
      <View style={styles.rowText}>
        <Text style={[styles.rowName, { color: c.text }]} numberOfLines={1}>{sku.name}</Text>
        <Text style={[styles.rowCode, { color: c.textMuted }]}>{sku.code}</Text>
      </View>
      <Text style={[styles.rowQty, { color: c.text }]}>{formatQuantity(sku.onHand)} <Text style={[styles.meta, { color: c.textMuted }]}>{sku.unit}</Text></Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  summary: { paddingHorizontal: spacing.s16, paddingVertical: spacing.s16, gap: spacing.s4 },
  zone: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '500' },
  meta: { ...type.caption, fontFamily: fontFamily.ui },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingRight: spacing.s16 },
  stripe: { width: spacing.s4, alignSelf: 'stretch', marginRight: spacing.s12 },
  rowText: { flex: 1, gap: 2 },
  rowName: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500' },
  rowCode: { ...type.caption, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowQty: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12, borderTopWidth: StyleSheet.hairlineWidth },
});
