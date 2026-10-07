// Quét: Immersive. The camera is the content; a reticle, torch and manual entry on a scrim inside the insets,
// Done top-right. Permission is asked at the moment of need with one sentence of benefit first [G5].
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { FilledField } from '../components/FilledField';
import { SurfaceStatusBar } from '../components/SurfaceStatusBar';
import { InkButton } from '../components/InkButton';
import { publishScan } from '../data/scan';
import { getSkuSync } from '../data/stock';
import { fontFamily, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export default function ScanScreen() {
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [manual, setManual] = useState('');
  const [miss, setMiss] = useState<string | null>(null);
  const busy = useRef(false);

  function deliver(code: string) {
    if (busy.current) return;
    busy.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (returnTo) {
      publishScan(code);
      router.back();
      return;
    }
    if (getSkuSync(code)) {
      router.replace({ pathname: '/sku/[code]', params: { code } });
      return;
    }
    setMiss(code);
    setTimeout(() => {
      busy.current = false;
    }, 1200);
  }

  const topInset = insets.top;

  if (!permission) return <View style={[styles.screen, { backgroundColor: c.text }]} />;

  if (!permission.granted) {
    return (
      <View style={[styles.screen, { backgroundColor: c.surface, paddingTop: topInset }]}>
        <SurfaceStatusBar />
        <Header onClose={() => router.back()} light={false} />
        <View style={styles.permission}>
          <Text style={[styles.permissionTitle, { color: c.text }]}>Camera để đọc mã vạch</Text>
          <Text style={[styles.permissionBody, { color: c.textMuted }]}>
            Để đọc mã vạch trên thùng hàng, app cần dùng camera. Bạn vẫn có thể nhập mã bằng tay bên dưới.
          </Text>
          {permission.canAskAgain ? (
            <View style={styles.permissionAction}>
              <InkButton label="Cho phép camera" onPress={() => requestPermission()} />
            </View>
          ) : (
            <Text style={[styles.permissionBody, { color: c.textMuted }]}>Camera đang bị tắt cho app này trong Cài đặt hệ thống.</Text>
          )}
        </View>
        <ManualEntry value={manual} onChange={setManual} onSubmit={() => manual && deliver(manual.trim())} bottom={insets.bottom} miss={miss} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.text }]}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'code128', 'code39', 'qr'] }}
        onBarcodeScanned={({ data }) => deliver(data)}
      />
      <View style={[styles.overlay, { paddingTop: topInset }]}>
        <StatusBar style="light" />
        <Header onClose={() => router.back()} light />
        <View style={styles.reticleWrap}>
          <View style={[styles.reticle, { borderColor: c.warn }]} />
          <Text style={[styles.reticleHint, { color: c.surface }]}>{miss ? `Không có SKU ${miss} trong danh mục. Quét mã khác hoặc nhập tay.` : 'Đưa mã vạch vào khung'}</Text>
        </View>
        <View style={styles.tools}>
          <Pressable onPress={() => setTorch((t) => !t)} accessibilityRole="button" accessibilityLabel={torch ? 'Tắt đèn' : 'Bật đèn'} accessibilityState={{ selected: torch }} style={[styles.tool, { backgroundColor: torch ? c.warn : c.scrimLight }]}>
            <MaterialIcons name={torch ? 'flashlight-on' : 'flashlight-off'} size={24} color={torch ? c.text : c.surface} />
          </Pressable>
        </View>
        <ManualEntry value={manual} onChange={setManual} onSubmit={() => manual && deliver(manual.trim())} bottom={insets.bottom} miss={null} dark />
      </View>
    </View>
  );
}

function Header({ onClose, light }: { onClose: () => void; light: boolean }) {
  const c = useTheme();
  return (
    <View style={styles.header}>
      <Text style={[styles.headerLabel, { color: light ? c.surface : c.text }]}>QUÉT MÃ</Text>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Xong" hitSlop={8} style={styles.headerAction}>
        <Text style={[styles.headerActionText, { color: light ? c.surface : c.text }]}>Xong</Text>
      </Pressable>
    </View>
  );
}

function ManualEntry({ value, onChange, onSubmit, bottom, miss, dark = false }: { value: string; onChange: (v: string) => void; onSubmit: () => void; bottom: number; miss: string | null; dark?: boolean }) {
  const c = useTheme();
  return (
    <KeyboardStickyView offset={{ closed: 0, opened: bottom }}>
      <View style={[styles.manual, { paddingBottom: bottom + spacing.s12, backgroundColor: dark ? c.scrim : c.surface }]}>
        <FilledField
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
          placeholder="Nhập mã thủ công"
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="go"
          accessibilityLabel="Mã SKU"
          error={miss ? `Không có SKU ${miss} trong danh mục` : undefined}
        />
      </View>
    </KeyboardStickyView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  header: { height: spacing.s48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.s16 },
  headerLabel: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 1 },
  headerAction: { minHeight: touch.min, minWidth: touch.min, justifyContent: 'center', alignItems: 'flex-end' },
  headerActionText: { ...type.bodyLg, fontFamily: fontFamily.ui, fontWeight: '600' },
  reticleWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.s16, paddingHorizontal: spacing.s24 },
  reticle: { width: 260, height: 160, borderWidth: 3 },
  reticleHint: { ...type.body, fontFamily: fontFamily.ui, textAlign: 'center' },
  tools: { flexDirection: 'row', justifyContent: 'center', paddingBottom: spacing.s16 },
  tool: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  manual: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12 },
  permission: { padding: spacing.s16, gap: spacing.s16, flex: 1 },
  permissionAction: { flexDirection: 'row' },
  permissionTitle: { ...type.heading, fontFamily: fontFamily.ui, fontWeight: '600' },
  permissionBody: { ...type.body, fontFamily: fontFamily.ui },
});
