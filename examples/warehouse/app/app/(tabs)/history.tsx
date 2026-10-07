// Lịch sử: List grouped by day. Rows: ink type tag, SKU, quantity, time. Undo within 5 s lives in the snackbar.
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { InkBar } from '../../components/InkBar';
import { formatQuantity, formatRelativeDay, formatTime, listMovements, useStock, type Movement } from '../../data/stock';
import { fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function HistoryScreen() {
  useStock();
  const c = useTheme();
  const movements = listMovements();
  const sections = groupByDay(movements);
  const today = movements.filter((m) => formatRelativeDay(m.at) === 'hôm nay' && !m.undone).length;

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar label="Lịch sử" count={`hôm nay ${today}`} />
      <SectionList
        sections={sections}
        keyExtractor={(m) => m.id}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.section, { color: c.textMuted, backgroundColor: c.surface }]}>{section.title}</Text>
        )}
        renderItem={({ item }) => <Row movement={item} />}
        ItemSeparatorComponent={() => <View style={[styles.divider, { backgroundColor: c.divider }]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: c.textMuted }]}>Chưa có phiếu nào. Mỗi lần nhập, xuất hay kiểm kê sẽ được ghi lại ở đây.</Text>
          </View>
        }
        stickySectionHeadersEnabled
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
    </View>
  );
}

function groupByDay(movements: Movement[]) {
  const map = new Map<string, Movement[]>();
  for (const m of movements) {
    const key = formatRelativeDay(m.at);
    map.set(key, [...(map.get(key) ?? []), m]);
  }
  return Array.from(map, ([title, data]) => ({ title: title.charAt(0).toUpperCase() + title.slice(1), data }));
}

function Row({ movement }: { movement: Movement }) {
  const c = useTheme();
  return (
    <View style={[styles.row, movement.undone && { opacity: 0.4 }]}>
      <View style={[styles.tag, { backgroundColor: c.text }]}>
        <Text style={[styles.tagText, { color: c.surface }]}>NHẬP</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowName, { color: c.text }]} numberOfLines={1}>{movement.skuName}</Text>
        <Text style={[styles.rowMeta, { color: c.textMuted }]}>
          <Text style={styles.rowCode}>{movement.skuCode}</Text>{movement.supplier ? ` · ${movement.supplier}` : ''}{movement.lot ? ` · lô ${movement.lot}` : ''}{movement.undone ? ' · đã hoàn tác' : ''}
        </Text>
      </View>
      <Text style={[styles.rowQty, { color: c.text }]}>+{formatQuantity(movement.quantity)}</Text>
      <Text style={[styles.rowTime, { color: c.textMuted }]}>{formatTime(movement.at)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  section: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: spacing.s16, paddingTop: spacing.s24, paddingBottom: spacing.s8 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.s12, paddingHorizontal: spacing.s16 },
  tag: { paddingHorizontal: spacing.s8, paddingVertical: spacing.s4 },
  tagText: { ...type.caption, fontWeight: '700', letterSpacing: 1 },
  rowText: { flex: 1, gap: 2 },
  rowName: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500' },
  rowCode: { fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowMeta: { ...type.caption, fontFamily: fontFamily.ui },
  rowQty: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowTime: { ...type.caption, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'], minWidth: 40, textAlign: 'right' },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: spacing.s16 },
  empty: { paddingHorizontal: spacing.s16, paddingVertical: spacing.s24 },
  emptyText: { ...type.body, fontFamily: fontFamily.ui },
});
