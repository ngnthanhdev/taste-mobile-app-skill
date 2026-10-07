// Nhập kho and Xuất kho share this Focused Task: the object (label block) first, the quantity as the hero input,
// the consequence live, secondary rows down to the CTA. Four states: loading SKU, no SKU yet, save failed
// (draft kept), ready. The two screens differ in consequence, secondary fields and CTA, not in composition.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { consumeScan } from '../data/scan';
import { showSnack } from '../data/snackbar';
import { formatQuantity, formatRelativeDay, getSku, issue, receive, suppliers, undoMovement, type Sku } from '../data/stock';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { DoneAccessory } from './DoneAccessory';
import { Chip } from './Chip';
import { FilledField } from './FilledField';
import { InkBar } from './InkBar';
import { InkButton } from './InkButton';
import { QuantityStepper } from './QuantityStepper';
import { SectionLabel } from './SectionLabel';
import { SkuLabel } from './SkuLabel';

const EXPIRY_OPTIONS = [
  { label: 'Không có HSD', months: 0 },
  { label: '6 tháng', months: 6 },
  { label: '12 tháng', months: 12 },
  { label: '24 tháng', months: 24 },
];

type Kind = 'receive' | 'issue';
const COPY: Record<Kind, { bar: string; quantityLabel: string; cta: string; done: string }> = {
  receive: { bar: 'Nhập kho', quantityLabel: 'Số lượng nhập', cta: 'Lưu phiếu', done: 'Đã nhập' },
  issue: { bar: 'Xuất kho', quantityLabel: 'Số lượng xuất', cta: 'Xác nhận xuất', done: 'Đã xuất' },
};

export function MovementScreen({ kind }: { kind: Kind }) {
  const c = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const copy = COPY[kind];
  const openedAt = useRef(Date.now());

  const [sku, setSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(Boolean(code));
  const [quantity, setQuantity] = useState(0);
  const [lot, setLot] = useState('');
  const [expiryMonths, setExpiryMonths] = useState(0);
  const [supplier, setSupplier] = useState<string | undefined>(undefined);
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadSku(next: string) {
    let alive = true;
    setLoading(true);
    getSku(next).then((found) => {
      if (!alive) return;
      setSku(found ?? null);
      setSupplier(found?.lastReceipt?.supplier);
      setLoading(false);
      if (!found) setError(`Không có SKU ${next} trong danh mục`);
    });
    return () => {
      alive = false;
    };
  }

  useEffect(() => (code ? loadSku(code) : undefined), [code]);

  // The scanner publishes its hit and pops back here; pick it up when this screen regains focus.
  useFocusEffect(
    React.useCallback(() => {
      const scanned = consumeScan(openedAt.current);
      if (scanned) {
        setError(null);
        loadSku(scanned);
      }
    }, []),
  );

  const dirty = quantity > 0 || lot.length > 0 || note.length > 0 || reference.length > 0;
  usePreventRemove(dirty && !saving, ({ data }: { data: { action: Parameters<typeof navigation.dispatch>[0] } }) => {
    Alert.alert(`Bỏ phiếu ${kind === 'receive' ? 'nhập' : 'xuất'} này?`, 'Số lượng và ghi chú chưa lưu sẽ mất.', [
      { text: 'Tiếp tục', style: 'cancel' },
      { text: 'Bỏ phiếu', style: 'destructive', onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  const over = kind === 'issue' && sku ? Math.max(0, quantity - sku.onHand) : 0;

  const consequence = useMemo(() => {
    if (!sku || quantity === 0) return null;
    const after = kind === 'receive' ? sku.onHand + quantity : sku.onHand - quantity;
    if (kind === 'issue' && after < 0) return `Tồn ${formatQuantity(sku.onHand)} ${sku.unit}, vượt tồn ${formatQuantity(over)}`;
    const below = after < sku.minimum;
    return `Tồn ${formatQuantity(sku.onHand)} → ${formatQuantity(after)} ${sku.unit}, ${
      below ? `${kind === 'issue' ? 'xuống' : 'vẫn'} dưới mức tối thiểu ${formatQuantity(sku.minimum)}` : `đủ mức tối thiểu ${formatQuantity(sku.minimum)}`
    }`;
  }, [sku, quantity, kind, over]);

  const canSave = Boolean(sku) && quantity > 0 && over === 0 && !saving;

  async function save() {
    if (!sku) return;
    setSaving(true);
    setError(null);
    try {
      const movement =
        kind === 'receive'
          ? await receive({
              skuCode: sku.code,
              quantity,
              lot: lot || undefined,
              expiry: expiryMonths ? new Date(Date.now() + expiryMonths * 30 * 86_400_000).toISOString().slice(0, 10) : undefined,
              supplier,
              note: note || undefined,
            })
          : await issue({ skuCode: sku.code, quantity, reference: reference || undefined, note: note || undefined });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSnack({ message: `${copy.done} ${formatQuantity(quantity)} ${sku.unit} · ${sku.name}`, actionLabel: 'Hoàn tác', onAction: () => undoMovement(movement.id) });
      router.back();
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : 'Không lưu được phiếu');
    }
  }

  const openScanner = () => router.push({ pathname: '/scan', params: { returnTo: '1' } });

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar
        label={copy.bar}
        count={sku ? formatQuantity(sku.onHand) : undefined}
        leading={{ icon: 'close', label: 'Đóng', onPress: () => router.back() }}
        trailing={[{ icon: 'qr-code-scanner', label: 'Quét mã vạch', onPress: openScanner }]}
        insetTop={Platform.OS !== 'ios'}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, { paddingBottom: spacing.s48 + spacing.s48 + insets.bottom }]}
        bottomOffset={spacing.s48 + spacing.s40}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={[styles.skeleton, { borderColor: c.divider }]} accessibilityLabel="Đang tải SKU" />
        ) : sku ? (
          <SkuLabel sku={sku} />
        ) : (
          <View style={[styles.noSku, { borderColor: c.textMuted }]}>
            <Text style={[styles.noSkuTitle, { color: c.text }]}>Chưa có SKU</Text>
            <Text style={[styles.noSkuBody, { color: c.textMuted }]}>Quét mã vạch trên thùng hoặc chọn một SKU trong tab Kho để bắt đầu phiếu.</Text>
            <View style={styles.chips}>
              <Chip label="Quét mã" onPress={openScanner} />
              <Chip label="Mở tab Kho" onPress={() => router.replace('/stock')} />
            </View>
          </View>
        )}

        <View style={styles.block}>
          <SectionLabel>{copy.quantityLabel}</SectionLabel>
          <QuantityStepper value={quantity} onChange={setQuantity} unit={sku?.unit ?? ''} disabled={!sku || loading} />
          {consequence ? (
            <Text style={[styles.consequence, { color: over > 0 ? c.danger : c.text }]} accessibilityLiveRegion="polite">{consequence}</Text>
          ) : null}
        </View>

        {kind === 'receive' ? (
          <>
            <View style={styles.block}>
              <SectionLabel>Lô và hạn dùng</SectionLabel>
              <FilledField
                value={lot}
                onChangeText={setLot}
                placeholder="Số lô (nếu có)"
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="next"
                editable={Boolean(sku)}
                accessibilityLabel="Số lô"
              />
              <View style={styles.chips}>
                {EXPIRY_OPTIONS.map((o) => (
                  <Chip key={o.months} label={o.label} selected={expiryMonths === o.months} onPress={() => setExpiryMonths(o.months)} disabled={!sku} />
                ))}
              </View>
            </View>
            <View style={styles.block}>
              <SectionLabel>Nhà cung cấp</SectionLabel>
              <View style={styles.chips}>
                {suppliers.map((s) => (
                  <Chip key={s} label={s} selected={supplier === s} onPress={() => setSupplier(s)} disabled={!sku} />
                ))}
              </View>
            </View>
            {sku?.lastReceipt ? (
              <LastRow label="Lần nhập trước" value={`${formatQuantity(sku.lastReceipt.quantity)} ${sku.unit} · ${sku.lastReceipt.supplier} · ${formatRelativeDay(sku.lastReceipt.at)}`} />
            ) : null}
          </>
        ) : (
          <>
            <View style={styles.block}>
              <SectionLabel>Phiếu xuất</SectionLabel>
              <FilledField
                value={reference}
                onChangeText={setReference}
                placeholder="Mã đơn hoặc phiếu xuất"
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="next"
                editable={Boolean(sku)}
                accessibilityLabel="Mã đơn"
              />
            </View>
            {sku?.lastIssue ? (
              <LastRow label="Lần xuất trước" value={`${formatQuantity(sku.lastIssue.quantity)} ${sku.unit} · ${sku.lastIssue.reference} · ${formatRelativeDay(sku.lastIssue.at)}`} />
            ) : null}
          </>
        )}

        <View style={styles.block}>
          <FilledField value={note} onChangeText={setNote} placeholder="Ghi chú" returnKeyType="done" editable={Boolean(sku)} accessibilityLabel="Ghi chú" />
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.s12, backgroundColor: c.surface, borderTopColor: c.divider }]}>
          {error ? (
            <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="assertive">
              {error}. {sku ? `Phiếu vẫn được giữ, bấm ${copy.cta} để thử lại.` : 'Quét lại hoặc chọn SKU khác.'}
            </Text>
          ) : null}
          <InkButton label={copy.cta} onPress={save} disabled={!canSave} loading={saving} />
        </View>
      </KeyboardStickyView>
      <DoneAccessory />
    </View>
  );
}

function LastRow({ label, value }: { label: string; value: string }) {
  const c = useTheme();
  return (
    <View style={[styles.lastRow, { borderTopColor: c.divider }]}>
      <Text style={[styles.lastLabel, { color: c.textMuted }]}>{label}</Text>
      <Text style={[styles.lastValue, { color: c.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.s16, gap: spacing.s24 },
  skeleton: { height: 148, borderWidth: 2, opacity: 0.5 },
  noSku: { borderWidth: 2, borderStyle: 'dashed', padding: spacing.s16, gap: spacing.s8 },
  noSkuTitle: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600' },
  noSkuBody: { ...type.body, fontFamily: fontFamily.ui },
  block: { gap: spacing.s12 },
  consequence: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s8 },
  lastRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.s12, gap: spacing.s4 },
  lastLabel: { ...type.caption, fontFamily: fontFamily.ui },
  lastValue: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.s8 },
  error: { ...type.body, fontFamily: fontFamily.ui },
});
