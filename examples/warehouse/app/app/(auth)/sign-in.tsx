// Đăng nhập: Focused Task with one path. Company code, email, password; errors per field on submit;
// the button carries the spinner. No social buttons: accounts are issued by the company.
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilledField } from '../../components/FilledField';
import { InkButton } from '../../components/InkButton';
import { SurfaceStatusBar } from '../../components/SurfaceStatusBar';
import { signIn, validateSignIn, type SignInErrors } from '../../data/session';
import { fontFamily, spacing, type } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';

export default function SignInScreen() {
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignInErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  async function submit() {
    const found = validateSignIn(company, email, password);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    try {
      await signIn(company, email, password);
      router.replace('/overview');
    } catch (e) {
      setSubmitting(false);
      const withErrors = e as { errors?: SignInErrors };
      setErrors(withErrors.errors ?? { password: 'Không đăng nhập được, thử lại' });
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: c.surface }]}>
      <SurfaceStatusBar />
      <KeyboardAwareScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.s24, paddingBottom: spacing.s48 + spacing.s48 + insets.bottom }]} bottomOffset={spacing.s48 + spacing.s40} keyboardShouldPersistTaps="handled">
        <View style={[styles.wordmark, { backgroundColor: c.accent }]}>
          <Text style={[styles.wordmarkText, { color: c.onAccent }]}>KHO</Text>
        </View>
        <Text style={[styles.title, { color: c.text }]}>Đăng nhập tài khoản kho</Text>
        <Text style={[styles.hint, { color: c.textMuted }]}>Tài khoản do công ty cấp. Mã công ty in trên thẻ nhân viên.</Text>
        <FilledField
          label="Mã công ty"
          value={company}
          onChangeText={setCompany}
          error={errors.company}
          autoFocus
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
          placeholder="Ví dụ KHO01"
        />
        <FilledField
          ref={emailRef}
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          textContentType="username"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <FilledField
          ref={passwordRef}
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
      </KeyboardAwareScrollView>
      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.s12, backgroundColor: c.surface }]}>
          <InkButton label="Đăng nhập" onPress={submit} loading={submitting} />
        </View>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.s16, gap: spacing.s16 },
  wordmark: { alignSelf: 'flex-start', paddingHorizontal: spacing.s12, paddingVertical: spacing.s8 },
  wordmarkText: { ...type.caption, fontFamily: fontFamily.ui, fontWeight: '700', letterSpacing: 2 },
  title: { ...type.heading, fontFamily: fontFamily.ui, fontWeight: '600', marginTop: spacing.s8 },
  hint: { ...type.body, fontFamily: fontFamily.ui, marginBottom: spacing.s8 },
  footer: { paddingHorizontal: spacing.s16, paddingTop: spacing.s12 },
});
