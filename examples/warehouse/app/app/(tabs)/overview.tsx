// Tổng quan: Dashboard. One headline count in the ink bar, the primary action, the low-stock module
// (the one module that earns size), then recent movements. No cards.
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { InkBar } from '../../components/InkBar';
import { InkButton } from '../../components/InkButton';
import { Snackbar } from '../../components/Snackbar';
import { formatQuantity, formatTime, listLowStock, listMovements, useStock, type Movement, type Sku } from '../../data/stock';
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
          <Text style={[styles.moduleTitle, { color: c.text }]}>Tồn thấp</Text>
          <Text style={[styles.moduleCount, { color: c.text }]}>{low.length} <Text style={[styles.moduleUnit, { color: c.textMuted }]}>SKU dưới mức tối thiểu</Text></Text>
          {low.slice(0, 3).map((sku) => (
            <LowRow key={sku.code} sku={sku} onPress={() => router.push({ pathname: '/receive', params: { code: sku.code } })} />
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <InkButton label="Nhập kho" onPress={() => router.push('/receive')} />
      </View>
      <Text style={[styles.section, { color: c.textMuted }]}>Phiếu gần đây</Text>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar label="Tổng quan" count={`${low.length} tồn thấp`} />
      <FlatList
        data={recent}
        keyExtractor={(m) => m.id}
        ListHeaderComponent={header}
        renderItem={({ item }) => <MovementRow movement={item} />}
        ItemSeparatorComponent={() => <View style={[styles.divider, { backgroundColor: c.divider }]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: c.textMuted }]}>Chưa có phiếu nào hôm nay. Phiếu nhập đầu tiên sẽ hiện ở đây.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
      <Snackbar />
    </View>
  );
}

function LowRow({ sku, onPress }: { sku: Sku; onPress: () => void }) {
  const c = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" android_ripple={{ color: c.divider }} style={styles.lowRow}>
      <Text style={[styles.lowName, { color: c.text }]} numberOfLines={1}>{sku.name}</Text>
      <Text style={[styles.rowQty, { color: c.text }]}>{formatQuantity(sku.onHand)}<Text style={{ color: c.textMuted }}>/{formatQuantity(sku.minimum)}</Text></Text>
    </Pressable>
  );
}

function MovementRow({ movement }: { movement: Movement }) {
  const c = useTheme();
  return (
    <View style={[styles.row, movement.undone && { opacity: 0.4 }]}>
      <View style={[styles.tag, { backgroundColor: c.text }]}>
        <Text style={[styles.tagText, { color: c.surface }]}>NHẬP</Text>
      </View>
      <Text style={[styles.lowName, { color: c.text }]} numberOfLines={1}>{movement.skuName}</Text>
      <Text style={[styles.rowQty, { color: c.text }]}>+{formatQuantity(movement.quantity)}</Text>
      <Text style={[styles.rowTime, { color: c.textMuted }]}>{formatTime(movement.at)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  actions: { flexDirection: 'row', paddingHorizontal: spacing.s16, paddingTop: spacing.s24 },
  module: { flexDirection: 'row', marginHorizontal: spacing.s16, marginTop: spacing.s16, borderWidth: 2 },
  stripe: { width: spacing.s8 },
  moduleBody: { flex: 1, padding: spacing.s12, gap: spacing.s4 },
  moduleTitle: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  moduleCount: { ...type.display, fontFamily: fontFamily.mono, fontWeight: '700', fontVariant: ['tabular-nums'] },
  moduleUnit: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '400' },
  lowRow: { minHeight: spacing.s48, flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  section: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: spacing.s16, paddingTop: spacing.s32, paddingBottom: spacing.s8 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.s12, paddingHorizontal: spacing.s16 },
  tag: { paddingHorizontal: spacing.s8, paddingVertical: spacing.s4 },
  tagText: { ...type.caption, fontWeight: '700', letterSpacing: 1 },
  lowName: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500', flex: 1 },
  rowQty: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowTime: { ...type.caption, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'], minWidth: 40, textAlign: 'right' },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: spacing.s16 },
  empty: { paddingHorizontal: spacing.s16, paddingVertical: spacing.s24 },
  emptyText: { ...type.body, fontFamily: fontFamily.ui },
});
