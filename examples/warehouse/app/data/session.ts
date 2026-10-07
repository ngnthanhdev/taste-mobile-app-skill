// Warehouse account session. Kept in memory for the example; a real app stores the token in SecureStore.
import { useSyncExternalStore } from 'react';
import { setCurrentUser } from './stock';

export type Session = { company: string; email: string; name: string };

const companies: Record<string, string> = { KHO01: 'Kho Bình Tân', KHO02: 'Kho Long Biên' };
let session: Session | null = null;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

export type SignInErrors = Partial<Record<'company' | 'email' | 'password', string>>;

export function validateSignIn(company: string, email: string, password: string): SignInErrors {
  const errors: SignInErrors = {};
  if (!company.trim()) errors.company = 'Nhập mã công ty';
  else if (!companies[company.trim().toUpperCase()]) errors.company = 'Không có công ty với mã này';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) errors.email = 'Email chưa đúng định dạng';
  if (password.length < 8) errors.password = 'Mật khẩu cần ít nhất 8 ký tự';
  return errors;
}

export async function signIn(company: string, email: string, password: string): Promise<Session> {
  const errors = validateSignIn(company, email, password);
  if (Object.keys(errors).length) throw Object.assign(new Error('invalid'), { errors });
  const code = company.trim().toUpperCase();
  const name = email.split('@')[0];
  session = { company: `${companies[code]} (${code})`, email: email.trim(), name };
  setCurrentUser(name);
  emit();
  return session;
}

export function signOut() {
  session = null;
  emit();
}

export function useSession(): Session | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => session,
  );
}
