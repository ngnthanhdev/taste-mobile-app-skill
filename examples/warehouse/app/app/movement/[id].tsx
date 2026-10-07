// Chi tiết phiếu: List. Type tag and signed quantity first, then the SKU, then meta rows. Undo within 24 h
// through a destructive dialog with Cancel; counts cannot be undone.
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Divider } from '../../components/Divider';
import { EmptyState } from '../../components/EmptyState';
import { InkButton } from '../../components/InkButton';
import { SectionLabel } from '../../components/SectionLabel';
import { SurfaceStatusBar } from '../../components/SurfaceStatusBar';
import { showSnack } from '../../data/snackbar';
import { canUndo, formatDateTime, formatSigned, getMovement, movementLabel, undoMovement, useStock } from '../../data/stock';
import { fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

const TITLE: Record<string, string> = { receive: 'Phiếu nhập', issue: 'Phiếu xuất', count: 'Điều chỉnh kiểm kê', adjust: 'Điều chỉnh nhanh' };

export default function MovementScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const movement = getMovement(id);

  if (!movement) {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface }]}>
        <Stack.Screen options={{ title: 'Phiếu' }} />
        <EmptyState message="Không tìm thấy phiếu này. Có thể nó thuộc phiên làm việc trước." actionLabel="Về Lịch sử" onAction={() => router.replace('/history')} />
      </View>
    );
  }

  const undoable = canUndo(movement);
  const rows: [string, string | undefined][] = [
    ['Người thực hiện', movement.by],
    ['Lúc', formatDateTime(movement.at)],
    ['Vị trí', movement.location],
    ['Số lô', movement.lot],
    ['Hạn dùng', movement.expiry],
    ['Nhà cung cấp', movement.supplier],
    ['Mã đơn', movement.reference],
    ['Lý do', movement.reason],
    ['Ghi chú', movement.note],
  ];

  function confirmUndo() {
    Alert.alert('Hoàn tác phiếu này?', `Tồn của ${movement!.skuName} sẽ trở về ${formatSigned(-movement!.delta)} so với hiện tại.`, [
      { text: 'Giữ phiếu', style: 'cancel' },
      {
        text: 'Hoàn tác',
        style: 'destructive',
        onPress: () => {
          if (undoMovement(movement!.id)) {
            showSnack({ message: `Đã hoàn tác ${movementLabel[movement!.type].toLowerCase()} ${formatSigned(movement!.delta)} ${movement!.unit}` });
            router.back();
          }
        },
      },
    ]);
  }

  return (
    <ScrollView style={[styles.screen, { backgroundColor: c.surface }]} contentContainerStyle={styles.content}>
      <SurfaceStatusBar />
      <Stack.Screen options={{ title: TITLE[movement.type] }} />
      <View style={styles.head}>
        <View style={[styles.tag, { backgroundColor: movement.undone ? c.textMuted : c.text }]}>
          <Text style={[styles.tagText, { color: c.surface }]}>{movement.undone ? 'ĐÃ HOÀN TÁC' : movementLabel[movement.type]}</Text>
        </View>
        <Text style={[styles.delta, { color: c.text }, movement.undone && styles.undone]}>{formatSigned(movement.delta)} <Text style={[styles.unit, { color: c.textMuted }]}>{movement.unit}</Text></Text>
        <Text style={[styles.name, { color: c.text }]}>{movement.skuName}</Text>
        <Text style={[styles.code, { color: c.textMuted }]}>{movement.skuCode}</Text>
      </View>
      <SectionLabel inset>Chi tiết</SectionLabel>
      {rows.filter(([, v]) => v).map(([label, value], i) => (
        <React.Fragment key={label}>
          {i > 0 ? <Divider /> : null}
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: c.textMuted }]}>{label}</Text>
            <Text style={[styles.rowValue, { color: c.text }]}>{value}</Text>
          </View>
        </React.Fragment>
      ))}
      <View style={styles.actions}>
        {undoable ? (
          <InkButton label="Hoàn tác" variant="outlined" onPress={confirmUndo} />
        ) : (
          <Text style={[styles.note, { color: c.textMuted }]}>
            {movement.undone ? 'Phiếu này đã được hoàn tác.' : movement.type === 'count' ? 'Điều chỉnh từ kiểm kê không hoàn tác được; lập phiếu điều chỉnh nếu cần.' : 'Quá 24 giờ, phiếu không hoàn tác được nữa.'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s48 },
  head: { padding: spacing.s16, gap: spacing.s8, alignItems: 'flex-start' },
  tag: { paddingHorizontal: spacing.s8, paddingVertical: spacing.s4 },
  tagText: { ...type.caption, fontWeight: '700', letterSpacing: 1 },
  delta: { ...type.display, fontFamily: fontFamily.mono, fontWeight: '700', fontVariant: ['tabular-nums'] },
  undone: { textDecorationLine: 'line-through' },
  unit: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '400' },
  name: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '500' },
  code: { ...type.body, fontFamily: fontFamily.mono, fontVariant: ['tabular-nums'] },
  row: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.s16, paddingHorizontal: spacing.s16 },
  rowLabel: { ...type.body, fontFamily: fontFamily.ui, width: 128 },
  rowValue: { ...type.body, fontFamily: fontFamily.ui, flex: 1 },
  actions: { padding: spacing.s16, paddingTop: spacing.s24, flexDirection: 'row' },
  note: { ...type.body, fontFamily: fontFamily.ui },
});
