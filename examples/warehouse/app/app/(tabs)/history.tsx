// Lịch sử: List grouped by day. Rows: ink type tag, SKU, quantity, time. The filter is a form sheet.
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Chip } from '../../components/Chip';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { InkBar } from '../../components/InkBar';
import { MovementRow } from '../../components/MovementRow';
import { Snackbar } from '../../components/Snackbar';
import { rangeLabel, rangeStart, resetHistoryFilter, useHistoryFilter } from '../../data/history-filter';
import { formatRelativeDay, listMovements, movementLabel, useStock, type Movement } from '../../data/stock';
import { fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function HistoryScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const filter = useHistoryFilter();
  const all = listMovements();
  const start = rangeStart(filter.range).getTime();
  const movements = all.filter((m) => new Date(m.at).getTime() >= start && (filter.types.length === 0 || filter.types.includes(m.type)));
  const sections = groupByDay(movements);
  const today = all.filter((m) => formatRelativeDay(m.at) === 'hôm nay' && !m.undone).length;
  const active = filter.types.length > 0 || filter.range !== '30d';

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar label="Lịch sử" count={`hôm nay ${today}`} trailing={[{ icon: 'filter-list', label: 'Lọc', onPress: () => router.push('/history-filter') }]} />
      {active ? (
        <View style={styles.filters}>
          <Text style={[styles.filterText, { color: c.textMuted }]} numberOfLines={1}>
            {[filter.types.map((t) => movementLabel[t].charAt(0) + movementLabel[t].slice(1).toLowerCase()).join(', '), rangeLabel[filter.range]].filter(Boolean).join(' · ')}
          </Text>
          <Chip label="Bỏ lọc" onPress={resetHistoryFilter} />
        </View>
      ) : null}
      <SectionList
        sections={sections}
        keyExtractor={(m) => m.id}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.section, { color: c.textMuted, backgroundColor: c.surface }]}>{section.title}</Text>
        )}
        renderItem={({ item }) => <MovementRow movement={item} />}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={
          active ? (
            <EmptyState message="Không có phiếu nào khớp bộ lọc." actionLabel="Bỏ lọc" onAction={resetHistoryFilter} />
          ) : (
            <EmptyState message="Chưa có phiếu nào. Mỗi lần nhập, xuất, kiểm kê hay điều chỉnh sẽ được ghi lại ở đây." />
          )
        }
        stickySectionHeadersEnabled
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
      <Snackbar />
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

const styles = StyleSheet.create({
  screen: { flex: 1 },
  filters: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12, paddingHorizontal: spacing.s16, paddingTop: spacing.s12 },
  filterText: { ...type.body, fontFamily: fontFamily.ui, flex: 1 },
  section: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: spacing.s16, paddingTop: spacing.s24, paddingBottom: spacing.s8 },
});
