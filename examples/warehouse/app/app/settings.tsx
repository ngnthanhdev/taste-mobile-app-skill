// Cài đặt: List. Groups by mental model, informational rows, the destructive action last in the danger color.
// No toggle lives here unless something reads it (tell G1).
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Divider } from '../components/Divider';
import { SectionLabel } from '../components/SectionLabel';
import { SurfaceStatusBar } from '../components/SurfaceStatusBar';
import { signOut, useSession } from '../data/session';
import { listLocations, listMovements, listSkus, useStock } from '../data/stock';
import { fontFamily, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export default function SettingsScreen() {
  useStock();
  const c = useTheme();
  const router = useRouter();
  const session = useSession();
  const pending = listMovements().filter((m) => !m.undone).length;

  function confirmSignOut() {
    Alert.alert('Đăng xuất?', 'Phiếu chưa đồng bộ sẽ được giữ trên máy cho lần đăng nhập sau.', [
      { text: 'Ở lại', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/sign-in');
        },
      },
    ]);
  }

  const groups: { title: string; rows: [string, string][] }[] = [
    { title: 'Tài khoản', rows: [['Tên', session?.name ?? 'Không rõ'], ['Email', session?.email ?? 'Không rõ'], ['Công ty', session?.company ?? 'Không rõ']] },
    { title: 'Kho', rows: [['Danh mục', `${listSkus().length} SKU`], ['Vị trí', `${listLocations().length} kệ`]] },
    { title: 'Máy in nhãn', rows: [['Trạng thái', 'Chưa kết nối máy in']] },
    { title: 'Đồng bộ', rows: [['Phiếu trong phiên', `${pending}`], ['Máy chủ', 'Chưa cấu hình; dữ liệu nằm trên máy']] },
  ];

  return (
    <ScrollView style={[styles.screen, { backgroundColor: c.surface }]} contentContainerStyle={styles.content}>
      <SurfaceStatusBar />
      <Stack.Screen options={{ title: 'Cài đặt' }} />
      {groups.map((g) => (
        <View key={g.title}>
          <SectionLabel inset>{g.title}</SectionLabel>
          {g.rows.map(([label, value], i) => (
            <React.Fragment key={label}>
              {i > 0 ? <Divider /> : null}
              <View style={styles.row}>
                <Text style={[styles.label, { color: c.text }]}>{label}</Text>
                <Text style={[styles.value, { color: c.textMuted }]} numberOfLines={1}>{value}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      ))}
      <View style={styles.signOutGroup}>
        <Pressable onPress={confirmSignOut} accessibilityRole="button" android_ripple={{ color: c.divider }} style={styles.row}>
          <Text style={[styles.label, { color: c.danger }]}>Đăng xuất</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: spacing.s48 },
  row: { minHeight: touch.min, flexDirection: 'row', alignItems: 'center', gap: spacing.s16, paddingHorizontal: spacing.s16 },
  label: { ...type.body, fontFamily: fontFamily.ui, fontWeight: '500' },
  value: { ...type.body, fontFamily: fontFamily.ui, flex: 1, textAlign: 'right' },
  signOutGroup: { marginTop: spacing.s32 },
});
