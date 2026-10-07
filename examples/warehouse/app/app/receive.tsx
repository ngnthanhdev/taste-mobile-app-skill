// Nhập kho: Focused Task. The object (label block) first, the quantity as the hero input, the consequence
// live, secondary rows down to the CTA. Four states: loading SKU, no SKU yet, save failed (draft kept), ready.
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { KeyboardAwareScrollView, KeyboardStickyView, KeyboardToolbar } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Chip } from '../components/Chip';
import { InkBar } from '../components/InkBar';
import { InkButton } from '../components/InkButton';
import { QuantityStepper } from '../components/QuantityStepper';
import { SkuLabel } from '../components/SkuLabel';
import { showSnack } from '../data/snackbar';
import { formatQuantity, formatRelativeDay, getSku, receive, suppliers, undoMovement, type Sku } from '../data/stock';
import { fontFamily, radius, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

const EXPIRY_OPTIONS = [
  { label: 'Không có HSD', months: 0 },
  { label: '6 tháng', months: 6 },
  { label: '12 tháng', months: 12 },
  { label: '24 tháng', months: 24 },
];

export default function ReceiveScreen() {
  const c = useTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { code } = useLocalSearchParams<{ code?: string }>();

  const [sku, setSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(Boolean(code));
  const [quantity, setQuantity] = useState(0);
  const [lot, setLot] = useState('');
  const [expiryMonths, setExpiryMonths] = useState(0);
  const [supplier, setSupplier] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    if (!code) return;
    setLoading(true);
    getSku(code).then((found) => {
      if (!alive) return;
      setSku(found ?? null);
      setSupplier(found?.lastReceipt?.supplier);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [code]);

  const dirty = quantity > 0 || lot.length > 0 || note.length > 0;
  usePreventRemove(dirty && !saving, ({ data }: { data: { action: Parameters<typeof navigation.dispatch>[0] } }) => {
    Alert.alert('Bỏ phiếu nhập này?', 'Số lượng và ghi chú chưa lưu sẽ mất.', [
      { text: 'Tiếp tục nhập', style: 'cancel' },
      { text: 'Bỏ phiếu', style: 'destructive', onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  const consequence = useMemo(() => {
    if (!sku || quantity === 0) return null;
    const after = sku.onHand + quantity;
    const below = after < sku.minimum;
    return `Tồn ${formatQuantity(sku.onHand)} → ${formatQuantity(after)} ${sku.unit}, ${
      below ? `vẫn dưới mức tối thiểu ${formatQuantity(sku.minimum)}` : `đủ mức tối thiểu ${formatQuantity(sku.minimum)}`
    }`;
  }, [sku, quantity]);

  const canSave = Boolean(sku) && quantity > 0 && !saving;

  async function save() {
    if (!sku) return;
    setSaving(true);
    setError(null);
    try {
      const expiry = expiryMonths ? new Date(Date.now() + expiryMonths * 30 * 86_400_000).toISOString().slice(0, 10) : undefined;
      const movement = await receive({ skuCode: sku.code, quantity, lot: lot || undefined, expiry, supplier, note: note || undefined });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSnack({ message: `Đã nhập ${formatQuantity(quantity)} ${sku.unit} · ${sku.name}`, actionLabel: 'Hoàn tác', onAction: () => undoMovement(movement.id) });
      router.back();
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : 'Không lưu được phiếu');
    }
  }

  const noSku = !code && !sku;

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <InkBar
        label="Nhập kho"
        count={sku ? formatQuantity(sku.onHand) : undefined}
        leading={{ icon: 'close', label: 'Đóng', onPress: () => router.back() }}
        insetTop={Platform.OS !== 'ios'}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, { paddingBottom: spacing.s48 + spacing.s48 + insets.bottom }]}
        bottomOffset={spacing.s24}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={[styles.skeleton, { borderColor: c.divider }]} accessibilityLabel="Đang tải SKU" />
        ) : sku ? (
          <SkuLabel sku={sku} />
        ) : (
          <View style={[styles.noSku, { borderColor: c.textMuted }]}>
            <Text style={[styles.noSkuTitle, { color: c.text }]}>Chưa có SKU</Text>
            <Text style={[styles.noSkuBody, { color: c.textMuted }]}>Quét mã vạch trên thùng hoặc chọn một SKU trong tab Kho để bắt đầu phiếu nhập.</Text>
            <View style={styles.noSkuActions}>
              <Chip label="Mở tab Kho" onPress={() => router.replace('/stock')} />
            </View>
          </View>
        )}

        <View style={styles.block}>
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Số lượng nhập</Text>
          <QuantityStepper value={quantity} onChange={setQuantity} unit={sku?.unit ?? ''} disabled={!sku || loading} />
          {consequence ? (
            <Text style={[styles.consequence, { color: c.text }]} accessibilityLiveRegion="polite">{consequence}</Text>
          ) : null}
        </View>

        <View style={styles.block}>
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Lô và hạn dùng</Text>
          <TextInput
            value={lot}
            onChangeText={setLot}
            placeholder="Số lô (nếu có)"
            placeholderTextColor={c.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="next"
            editable={Boolean(sku)}
            accessibilityLabel="Số lô"
            style={[styles.field, { backgroundColor: c.surfaceAlt, color: c.text, borderBottomColor: c.textMuted }]}
          />
          <View style={styles.chips}>
            {EXPIRY_OPTIONS.map((o) => (
              <Chip key={o.months} label={o.label} selected={expiryMonths === o.months} onPress={() => setExpiryMonths(o.months)} disabled={!sku} />
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Nhà cung cấp</Text>
          <View style={styles.chips}>
            {suppliers.map((s) => (
              <Chip key={s} label={s} selected={supplier === s} onPress={() => setSupplier(s)} disabled={!sku} />
            ))}
          </View>
        </View>

        {sku?.lastReceipt ? (
          <View style={[styles.lastRow, { borderTopColor: c.divider }]}>
            <Text style={[styles.lastLabel, { color: c.textMuted }]}>Lần nhập trước</Text>
            <Text style={[styles.lastValue, { color: c.text }]}>
              {formatQuantity(sku.lastReceipt.quantity)} {sku.unit} · {sku.lastReceipt.supplier} · {formatRelativeDay(sku.lastReceipt.at)}
            </Text>
          </View>
        ) : null}

        <View style={styles.block}>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Ghi chú"
            placeholderTextColor={c.textMuted}
            returnKeyType="done"
            editable={Boolean(sku)}
            accessibilityLabel="Ghi chú"
            style={[styles.field, { backgroundColor: c.surfaceAlt, color: c.text, borderBottomColor: c.textMuted }]}
          />
        </View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.s12, backgroundColor: c.surface, borderTopColor: c.divider }]}>
          {error ? <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="assertive">{error}. Phiếu vẫn được giữ, bấm Lưu để thử lại.</Text> : null}
          <InkButton label="Lưu phiếu" onPress={save} disabled={!canSave} loading={saving} />
        </View>
      </KeyboardStickyView>
      {Platform.OS === 'ios' ? <KeyboardToolbar doneText="Xong" /> : null}
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
  noSkuActions: { flexDirection: 'row', paddingTop: spacing.s4 },
  block: { gap: spacing.s12 },
  sectionLabel: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  consequence: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  field: { ...type.bodyLg, fontFamily: fontFamily.ui, height: 52, paddingHorizontal: spacing.s16, borderBottomWidth: 1, borderTopLeftRadius: radius.field, borderTopRightRadius: radius.field },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s8 },
  lastRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.s12, gap: spacing.s4 },
  lastLabel: { ...type.caption, fontFamily: fontFamily.ui },
  lastValue: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.s8 },
  error: { ...type.body, fontFamily: fontFamily.ui },
});
