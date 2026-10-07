// Step 2: count every SKU at the location. Focused Task: the current SKU with its stepper is the hero,
// the book vs counted line is the consequence, the remaining SKUs sit below as collapsed rows.
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider } from '../../../components/Divider';
import { EmptyState } from '../../../components/EmptyState';
import { DoneAccessory } from '../../../components/DoneAccessory';
import { InkBar } from '../../../components/InkBar';
import { InkButton } from '../../../components/InkButton';
import { QuantityStepper } from '../../../components/QuantityStepper';
import { SectionLabel } from '../../../components/SectionLabel';
import { clearCount, setCounted, useCountDraft } from '../../../data/count';
import { formatQuantity, formatSigned, listSkusAt, useStock } from '../../../data/stock';
import { fontFamily, spacing, type } from '../../../theme/tokens';
import { useTheme } from '../../../theme/useTheme';

export default function CountScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const draft = useCountDraft();
  const skus = useMemo(() => listSkusAt(id), [id]);
  const counted = draft?.counted ?? {};
  const [index, setIndex] = useState(() => Math.max(0, skus.findIndex((s) => counted[s.code] === undefined)));
  const current = skus[index];
  const [value, setValue] = useState<number>(() => (current ? counted[current.code] ?? 0 : 0));
  const done = skus.filter((s) => counted[s.code] !== undefined).length;

  const started = Object.keys(counted).length > 0;
  usePreventRemove(started, ({ data }: { data: { action: Parameters<typeof navigation.dispatch>[0] } }) => {
    Alert.alert('Bỏ kiểm kê?', `${done} SKU đã đếm ở ${id} sẽ không được lưu.`, [
      { text: 'Tiếp tục đếm', style: 'cancel' },
      {
        text: 'Bỏ kiểm kê',
        style: 'destructive',
        onPress: () => {
          clearCount();
          navigation.dispatch(data.action);
        },
      },
    ]);
  });

  function jumpTo(i: number) {
    const sku = skus[i];
    if (!sku) return;
    setIndex(i);
    setValue(counted[sku.code] ?? 0);
  }

  function next() {
    if (!current) return;
    setCounted(current.code, value);
    const after = { ...counted, [current.code]: value };
    const nextIndex = skus.findIndex((s, i) => i !== index && after[s.code] === undefined);
    if (nextIndex === -1) router.push({ pathname: '/(count)/[id]/review', params: { id } });
    else jumpTo(nextIndex);
  }

  const diff = current ? value - current.onHand : 0;
  const allDone = done === skus.length && skus.length > 0;

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar label={`Kiểm kê · ${id}`} count={`${done}/${skus.length}`} leading={{ icon: 'arrow-back', label: 'Quay lại', onPress: () => router.back() }} />
      {skus.length === 0 ? (
        <EmptyState message={`Kệ ${id} không có SKU nào trong sổ. Nhập hàng vào kệ trước, hoặc chọn kệ khác.`} actionLabel="Chọn kệ khác" onAction={() => router.back()} />
      ) : (
        <>
          <KeyboardAwareScrollView contentContainerStyle={[styles.content, { paddingBottom: spacing.s48 + spacing.s48 + insets.bottom }]} bottomOffset={spacing.s48 + spacing.s40} keyboardShouldPersistTaps="handled">
            {current ? (
              <View style={styles.block}>
                <Text style={[styles.name, { color: c.text }]}>{current.name}</Text>
                <Text style={[styles.code, { color: c.textMuted }]}>{current.code}</Text>
                <QuantityStepper value={value} onChange={setValue} unit={current.unit} quickAdds={[5, 10, 50]} />
                <Text style={[styles.consequence, { color: diff < 0 ? c.danger : c.text }]} accessibilityLiveRegion="polite">
                  Sổ {formatQuantity(current.onHand)} · Đếm {formatQuantity(value)} · lệch {formatSigned(diff)}
                </Text>
              </View>
            ) : null}
            <View>
              <SectionLabel>Các SKU trên kệ</SectionLabel>
              <View style={{ height: spacing.s8 }} />
              {skus.map((s, i) => (
                <React.Fragment key={s.code}>
                  {i > 0 ? <Divider inset={false} /> : null}
                  <Pressable onPress={() => jumpTo(i)} accessibilityRole="button" accessibilityState={{ selected: i === index }} android_ripple={{ color: c.divider }} style={[styles.row, i === index && { backgroundColor: c.surfaceAlt }]}>
                    <Text style={[styles.rowName, { color: c.text }]} numberOfLines={1}>{s.name}</Text>
                    <Text style={[counted[s.code] === undefined ? styles.rowPending : styles.rowValue, { color: counted[s.code] === undefined ? c.textMuted : c.text }]}>
                      {counted[s.code] === undefined ? 'chưa đếm' : `${formatQuantity(counted[s.code])} / ${formatQuantity(s.onHand)}`}
                    </Text>
                  </Pressable>
                </React.Fragment>
              ))}
            </View>
          </KeyboardAwareScrollView>
          <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.s12, backgroundColor: c.surface, borderTopColor: c.divider }]}>
              <InkButton label={allDone || index === skus.length - 1 ? 'Xem lại' : 'Tiếp'} onPress={next} />
            </View>
          </KeyboardStickyView>
          <DoneAccessory />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.s16, gap: spacing.s24 },
  block: { gap: spacing.s12 },
  name: { ...type.heading, fontFamily: fontFamily.ui, fontWeight: '600' },
  code: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  consequence: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.s12, paddingHorizontal: spacing.s8 },
  rowName: { ...type.body, fontFamily: fontFamily.ui, flex: 1 },
  rowValue: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowPending: { ...type.body, fontFamily: fontFamily.ui },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12, borderTopWidth: StyleSheet.hairlineWidth },
});
