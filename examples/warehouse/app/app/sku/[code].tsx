// Chi tiết SKU: Hero. The label block with its barcode is the object and takes the top third; stock by
// location, the two movement actions and recent movements follow as grouped lists. Native header, no ink bar.
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Chip } from '../../components/Chip';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { InkButton } from '../../components/InkButton';
import { MovementRow } from '../../components/MovementRow';
import { SectionLabel } from '../../components/SectionLabel';
import { SkuLabel } from '../../components/SkuLabel';
import { SurfaceStatusBar } from '../../components/SurfaceStatusBar';
import { formatQuantity, formatRelativeDay, getLocation, getSkuSync, listMovementsFor, useStock } from '../../data/stock';
import { fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function SkuDetailScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();
  const sku = getSkuSync(code);
  const movements = sku ? listMovementsFor(sku.code).slice(0, 10) : [];
  const location = sku ? getLocation(sku.location) : undefined;

  if (!sku) {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <Stack.Screen options={{ title: 'SKU' }} />
        <EmptyState message={`Không có SKU ${code} trong danh mục. Có thể mã đã bị gỡ hoặc quét nhầm.`} actionLabel="Về tab Kho" onAction={() => router.replace('/stock')} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: c.surface }]} contentContainerStyle={styles.content}>
      <SurfaceStatusBar />
      <Stack.Screen options={{ title: sku.name }} />
      <View style={styles.hero}>
        <SkuLabel sku={sku} />
      </View>
      <SectionLabel inset>Tồn theo vị trí</SectionLabel>
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={[styles.rowCode, { color: c.text }]}>{sku.location}</Text>
          <Text style={[styles.rowMeta, { color: c.textMuted }]}>{location?.zone ?? 'Vị trí chưa có trong sơ đồ'}{sku.lastCount ? ` · đếm ${formatRelativeDay(sku.lastCount)}` : ' · chưa kiểm kê'}</Text>
        </View>
        <Text style={[styles.rowQty, { color: c.text }]}>{formatQuantity(sku.onHand)} <Text style={[styles.rowMeta, { color: c.textMuted }]}>{sku.unit}</Text></Text>
      </View>
      <View style={styles.actions}>
        <InkButton label="Nhập" onPress={() => router.push({ pathname: '/receive', params: { code: sku.code } })} />
        <InkButton label="Xuất" variant="outlined" onPress={() => router.push({ pathname: '/issue', params: { code: sku.code } })} />
      </View>
      <View style={styles.adjust}>
        <Chip label="Điều chỉnh nhanh" onPress={() => router.push({ pathname: '/adjust', params: { code: sku.code } })} />
        <Chip label={`Vị trí ${sku.location}`} onPress={() => router.push({ pathname: '/location/[id]', params: { id: sku.location } })} />
      </View>
      <SectionLabel inset>Giao dịch gần đây</SectionLabel>
      {movements.length === 0 ? (
        <EmptyState message="Chưa có giao dịch nào cho SKU này." />
      ) : (
        movements.map((m, i) => (
          <React.Fragment key={m.id}>
            {i > 0 ? <Divider /> : null}
            <MovementRow movement={m} showCode={false} />
          </React.Fragment>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s48 },
  hero: { padding: spacing.s16 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.s12, paddingHorizontal: spacing.s16 },
  rowText: { flex: 1, gap: 2 },
  rowCode: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowMeta: { ...type.caption, fontFamily: fontFamily.ui },
  rowQty: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  actions: { flexDirection: 'row', gap: spacing.s12, paddingHorizontal: spacing.s16, paddingTop: spacing.s16 },
  adjust: { flexDirection: 'row', gap: spacing.s8, paddingHorizontal: spacing.s16, paddingTop: spacing.s12 },
});
