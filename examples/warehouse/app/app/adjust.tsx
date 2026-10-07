// Điều chỉnh nhanh: a form sheet on the SKU detail. Direction, amount, reason, save. Less than one screen,
// no navigation inside, returns to its parent.
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { DoneAccessory } from '../components/DoneAccessory';
import { Chip } from '../components/Chip';
import { InkButton } from '../components/InkButton';
import { QuantityStepper } from '../components/QuantityStepper';
import { SectionLabel } from '../components/SectionLabel';
import { showSnack } from '../data/snackbar';
import { adjust, adjustReasons, formatQuantity, getSkuSync, undoMovement, useStock } from '../data/stock';
import { fontFamily, spacing, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export default function AdjustSheet() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { code } = useLocalSearchParams<{ code: string }>();
  const sku = getSkuSync(code);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delta = direction === 'down' ? -amount : amount;
  const after = sku ? sku.onHand + delta : 0;
  const canSave = Boolean(sku) && amount > 0 && Boolean(reason) && after >= 0 && !saving;

  async function save() {
    if (!sku || !reason) return;
    setSaving(true);
    setError(null);
    try {
      const movement = await adjust(sku.code, delta, reason);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSnack({ message: `Đã điều chỉnh ${delta > 0 ? '+' : '−'}${formatQuantity(amount)} ${sku.unit} · ${reason}`, actionLabel: 'Hoàn tác', onAction: () => undoMovement(movement.id) });
      router.back();
    } catch (e) {
      setSaving(false);
      setError(e instanceof Error ? e.message : 'Không lưu được điều chỉnh');
    }
  }

  return (
    <View style={[styles.sheet, { backgroundColor: c.surface }]}>
      <KeyboardAwareScrollView contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, spacing.s16) }]} bottomOffset={spacing.s24} keyboardShouldPersistTaps="handled">
        <View style={styles.head}>
          <Text style={[styles.title, { color: c.text }]}>Điều chỉnh nhanh</Text>
          <Text style={[styles.sku, { color: c.textMuted }]} numberOfLines={1}>{sku ? `${sku.name} · tồn ${formatQuantity(sku.onHand)} ${sku.unit}` : 'Không tìm thấy SKU'}</Text>
        </View>
        <View style={styles.chips}>
          <Chip label="Giảm" selected={direction === 'down'} onPress={() => setDirection('down')} />
          <Chip label="Tăng" selected={direction === 'up'} onPress={() => setDirection('up')} />
        </View>
        <QuantityStepper value={amount} onChange={setAmount} unit={sku?.unit ?? ''} quickAdds={[1, 5, 10]} disabled={!sku} />
        {sku && amount > 0 ? (
          <Text style={[styles.consequence, { color: after < 0 ? c.danger : c.text }]} accessibilityLiveRegion="polite">
            {after < 0 ? `Tồn không thể âm (${formatQuantity(sku.onHand)} − ${formatQuantity(amount)})` : `Tồn ${formatQuantity(sku.onHand)} → ${formatQuantity(after)} ${sku.unit}`}
          </Text>
        ) : null}
        <SectionLabel>Lý do</SectionLabel>
        <View style={styles.chips}>
          {adjustReasons.map((r) => (
            <Chip key={r} label={r} selected={reason === r} onPress={() => setReason(r)} disabled={!sku} />
          ))}
        </View>
        {error ? <Text style={[styles.error, { color: c.danger }]} accessibilityLiveRegion="assertive">{error}</Text> : null}
        <View style={styles.actions}>
          <InkButton label="Lưu" onPress={save} disabled={!canSave} loading={saving} />
        </View>
      </KeyboardAwareScrollView>
      <DoneAccessory />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1 },
  content: { padding: spacing.s16, paddingTop: spacing.s24, gap: spacing.s16 },
  head: { gap: spacing.s4 },
  title: { ...type.heading, fontFamily: fontFamily.ui, fontWeight: '600' },
  sku: { ...type.body, fontFamily: fontFamily.ui },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s8 },
  consequence: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  error: { ...type.body, fontFamily: fontFamily.ui },
  actions: { flexDirection: 'row', paddingTop: spacing.s8 },
});
