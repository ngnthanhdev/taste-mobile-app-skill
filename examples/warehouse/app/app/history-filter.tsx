// Lọc lịch sử: a form sheet with five controls, returns to its parent. Sheets never navigate.
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chip } from '../components/Chip';
import { InkButton } from '../components/InkButton';
import { SectionLabel } from '../components/SectionLabel';
import { rangeLabel, resetHistoryFilter, setHistoryFilter, useHistoryFilter, type Range } from '../data/history-filter';
import { movementLabel, type MovementType } from '../data/stock';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

const TYPES: MovementType[] = ['receive', 'issue', 'count', 'adjust'];
const RANGES: Range[] = ['today', '7d', '30d'];

export default function HistoryFilterSheet() {
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const current = useHistoryFilter();
  const [types, setTypes] = useState<MovementType[]>(current.types);
  const [range, setRange] = useState<Range>(current.range);

  function toggle(t: MovementType) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  return (
    <View style={[styles.sheet, { backgroundColor: c.surface, paddingBottom: Math.max(insets.bottom, spacing.s16) }]}>
      <Text style={[styles.title, { color: c.text }]}>Lọc lịch sử</Text>
      <SectionLabel>Loại phiếu</SectionLabel>
      <View style={styles.chips}>
        {TYPES.map((t) => (
          <Chip key={t} label={movementLabel[t].charAt(0) + movementLabel[t].slice(1).toLowerCase()} selected={types.includes(t)} onPress={() => toggle(t)} />
        ))}
      </View>
      <SectionLabel>Khoảng thời gian</SectionLabel>
      <View style={styles.chips}>
        {RANGES.map((r) => (
          <Chip key={r} label={rangeLabel[r]} selected={range === r} onPress={() => setRange(r)} />
        ))}
      </View>
      <View style={styles.actions}>
        <InkButton
          label="Áp dụng"
          onPress={() => {
            setHistoryFilter({ types, range });
            router.back();
          }}
        />
        <Chip
          label="Bỏ lọc"
          onPress={() => {
            resetHistoryFilter();
            router.back();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, padding: spacing.s16, paddingTop: spacing.s24, gap: spacing.s16 },
  title: { ...type.heading, fontFamily: fontFamily.ui, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12, paddingTop: spacing.s8 },
});
