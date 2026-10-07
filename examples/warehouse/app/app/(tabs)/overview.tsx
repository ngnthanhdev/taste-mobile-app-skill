// Tổng quan: Dashboard. The low-stock headline module is the anchor under the ink bar, then the actions,
// then recent movements. No cards; the module is the one container that earns its size.
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { InkBar } from '../../components/InkBar';
import { InkButton } from '../../components/InkButton';
import { MovementRow } from '../../components/MovementRow';
import { SectionLabel } from '../../components/SectionLabel';
import { Snackbar } from '../../components/Snackbar';
import { formatQuantity, listLowStock, listMovements, useStock, type Sku } from '../../data/stock';
import { fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function OverviewScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const low = listLowStock();
  const recent = listMovements().slice(0, 10);

  const header = (
    <View>
      <View style={[styles.module, { borderColor: c.text }]}>
        <View style={[styles.stripe, { backgroundColor: c.warn }]} />
        <View style={styles.moduleBody}>
          <SectionLabel>Tồn thấp</SectionLabel>
          <Text style={[styles.moduleCount, { color: c.text }]}>
            {low.length} <Text style={[styles.moduleUnit, { color: c.textMuted }]}>SKU dưới mức tối thiểu</Text>
          </Text>
          {low.slice(0, 3).map((sku) => (
            <LowRow key={sku.code} sku={sku} onPress={() => router.push({ pathname: '/receive', params: { code: sku.code } })} />
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <InkButton label="Nhập kho" onPress={() => router.push('/receive')} />
      </View>
      <View style={styles.secondary}>
        <InkButton label="Xuất kho" variant="outlined" onPress={() => router.push('/issue')} />
        <InkButton label="Kiểm kê" variant="outlined" onPress={() => router.push('/(count)/location')} />
      </View>
      <SectionLabel inset>Phiếu gần đây</SectionLabel>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar
        label="Tổng quan"
        count={`${low.length} tồn thấp`}
        trailing={[
          { icon: 'qr-code-scanner', label: 'Quét mã vạch', onPress: () => router.push('/scan') },
          { icon: 'settings', label: 'Cài đặt', onPress: () => router.push('/settings') },
        ]}
      />
      <FlatList
        data={recent}
        keyExtractor={(m) => m.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => <MovementRow movement={item} />}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={<EmptyState message="Chưa có phiếu nào hôm nay. Phiếu nhập đầu tiên sẽ hiện ở đây." />}
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
      <Snackbar />
    </View>
  );
}

function LowRow({ sku, onPress }: { sku: Sku; onPress: () => void }) {
  const c = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Nhập ${sku.name}`} android_ripple={{ color: c.divider }} style={styles.lowRow}>
      <Text style={[styles.lowName, { color: c.text }]} numberOfLines={1}>{sku.name}</Text>
      <Text style={[styles.rowQty, { color: c.text }]}>{formatQuantity(sku.onHand)}<Text style={{ color: c.textMuted }}>/{formatQuantity(sku.minimum)}</Text></Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  module: { flexDirection: 'row', marginHorizontal: spacing.s16, marginTop: spacing.s16, borderWidth: 2 },
  stripe: { width: spacing.s8 },
  moduleBody: { flex: 1, padding: spacing.s12, gap: spacing.s4 },
  moduleCount: { ...type.display, fontFamily: fontFamily.mono, fontWeight: '700', fontVariant: ['tabular-nums'] },
  moduleUnit: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '400' },
  lowRow: { minHeight: spacing.s48, flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  lowName: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500', flex: 1 },
  rowQty: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  actions: { flexDirection: 'row', paddingHorizontal: spacing.s16, paddingTop: spacing.s24 },
  secondary: { flexDirection: 'row', gap: spacing.s12, paddingHorizontal: spacing.s16, paddingTop: spacing.s12 },
});
