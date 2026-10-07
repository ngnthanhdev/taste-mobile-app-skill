// Step 3: confirm the differences. Number-first: the total difference line, then only the SKUs that differ.
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Divider } from '../../../components/Divider';
import { InkBar } from '../../../components/InkBar';
import { InkButton } from '../../../components/InkButton';
import { clearCount, useCountDraft } from '../../../data/count';
import { showSnack } from '../../../data/snackbar';
import { commitCount, formatQuantity, formatSigned, listSkusAt, useStock } from '../../../data/stock';
import { fontFamily, spacing, type } from '../../../theme/tokens';
import { useTheme } from '../../../theme/useTheme';

export default function CountReviewScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const draft = useCountDraft();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const skus = useMemo(() => listSkusAt(id), [id]);
  const counted = draft?.counted ?? {};
  const diffs = skus
    .filter((s) => counted[s.code] !== undefined && counted[s.code] !== s.onHand)
    .map((s) => ({ sku: s, counted: counted[s.code], delta: counted[s.code] - s.onHand }));

  async function commit() {
    setSaving(true);
    setError(null);
    try {
      const movements = await commitCount(id, counted);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSnack({ message: `Đã chốt kiểm kê ${id} · ${movements.length} điều chỉnh` });
      clearCount();
      router.navigate('/overview');
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : 'Không chốt được kiểm kê');
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar label={`Xem lại · ${id}`} leading={{ icon: 'arrow-back', label: 'Quay lại', onPress: () => router.back() }} />
      <View style={styles.headline}>
        <Text style={[styles.count, { color: c.text }]}>
          {diffs.length} <Text style={[styles.countUnit, { color: c.textMuted }]}>lệch / {skus.length} SKU</Text>
        </Text>
        <Text style={[styles.hint, { color: c.textMuted }]}>
          {diffs.length === 0 ? 'Số đếm khớp sổ. Chốt để ghi ngày kiểm kê cho kệ này.' : 'Mỗi dòng lệch sẽ thành một phiếu điều chỉnh tồn. Không hoàn tác được sau khi chốt.'}
        </Text>
      </View>
      <View style={styles.list}>
        {diffs.map((d, i) => (
          <React.Fragment key={d.sku.code}>
            {i > 0 ? <Divider /> : null}
            <View style={styles.row}>
              <View style={[styles.stripe, { backgroundColor: d.delta < 0 ? c.warn : 'transparent' }]} />
              <View style={styles.rowText}>
                <Text style={[styles.rowName, { color: c.text }]} numberOfLines={1}>{d.sku.name}</Text>
                <Text style={[styles.rowMeta, { color: c.textMuted }]}>Sổ {formatQuantity(d.sku.onHand)} · Đếm {formatQuantity(d.counted)} {d.sku.unit}</Text>
              </View>
              <Text style={[styles.rowDelta, { color: c.text }]}>{formatSigned(d.delta)}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
      <View style={styles.spacer} />
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.s12, borderTopColor: c.divider }]}>
        {error ? <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="assertive">{error}. Bấm Chốt kiểm kê để thử lại.</Text> : null}
        <InkButton label="Chốt kiểm kê" onPress={commit} loading={saving} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headline: { padding: spacing.s16, gap: spacing.s8 },
  count: { ...type.display, fontFamily: fontFamily.mono, fontWeight: '700', fontVariant: ['tabular-nums'] },
  countUnit: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '400' },
  hint: { ...type.body, fontFamily: fontFamily.ui },
  list: {},
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingRight: spacing.s16 },
  stripe: { width: spacing.s4, alignSelf: 'stretch', marginRight: spacing.s12 },
  rowText: { flex: 1, gap: 2 },
  rowName: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500' },
  rowMeta: { ...type.caption, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  rowDelta: { ...type.bodyLg, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  spacer: { flex: 1 },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.s8 },
  error: { ...type.body, fontFamily: fontFamily.ui },
});
