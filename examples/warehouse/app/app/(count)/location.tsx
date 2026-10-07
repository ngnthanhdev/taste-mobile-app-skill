// Step 1: pick the shelf to count. List: search, then location rows with SKU count and last-count date.
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { FilledField } from '../../components/FilledField';
import { InkBar } from '../../components/InkBar';
import { startCount } from '../../data/count';
import { formatRelativeDay, listLocations, listSkusAt, useStock, type Location } from '../../data/stock';
import { fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function CountLocationScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const { location } = useLocalSearchParams<{ location?: string }>();
  const [query, setQuery] = useState('');
  const all = listLocations();
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((l) => !q || l.code.toLowerCase().includes(q) || l.zone.toLowerCase().includes(q));
  }, [all, query]);

  function begin(code: string) {
    startCount(code);
    router.push({ pathname: '/(count)/[id]', params: { id: code } });
  }

  // Opened from a location screen: the shelf is already chosen.
  useEffect(() => {
    if (location) begin(location);
  }, [location]);

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar label="Kiểm kê" count={`${all.length} vị trí`} leading={{ icon: 'close', label: 'Đóng', onPress: () => router.back() }} />
      <View style={styles.tools}>
        <FilledField value={query} onChangeText={setQuery} placeholder="Tìm mã kệ hoặc khu" returnKeyType="search" autoCapitalize="characters" autoCorrect={false} accessibilityLabel="Tìm vị trí" />
      </View>
      <FlatList
        data={data}
        keyExtractor={(l) => l.code}
        renderItem={({ item }) => <LocationRow location={item} onPress={() => begin(item.code)} />}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={<EmptyState message={all.length ? `Không có vị trí nào khớp "${query}".` : 'Chưa có vị trí. Thêm vị trí trong Cài đặt kho trước khi kiểm kê.'} />}
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: spacing.s24 }}
      />
    </View>
  );
}

function LocationRow({ location, onPress }: { location: Location; onPress: () => void }) {
  const c = useTheme();
  const count = listSkusAt(location.code).length;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" android_ripple={{ color: c.divider }} style={styles.row}>
      <View style={styles.rowText}>
        <Text style={[styles.code, { color: c.text }]}>{location.code}</Text>
        <Text style={[styles.meta, { color: c.textMuted }]}>{location.zone}</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={[styles.count, { color: c.text }]}>{count} <Text style={[styles.meta, { color: c.textMuted }]}>SKU</Text></Text>
        <Text style={[styles.meta, { color: c.textMuted }]}>{location.lastCount ? `Đếm ${formatRelativeDay(location.lastCount)}` : 'Chưa đếm'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  tools: { paddingHorizontal: spacing.s16, paddingVertical: spacing.s12 },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.s16, gap: spacing.s12 },
  rowText: { flex: 1, gap: 2 },
  rowRight: { alignItems: 'flex-end', gap: 2 },
  code: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  count: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  meta: { ...type.caption, fontFamily: fontFamily.ui },
});
