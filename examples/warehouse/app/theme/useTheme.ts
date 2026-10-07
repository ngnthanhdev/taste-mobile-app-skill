import { useColorScheme } from 'react-native';
import { colors, type Palette } from './tokens';

export function useTheme(): Palette {
  const scheme = useColorScheme();
  return scheme === 'dark' ? colors.dark : colors.light;
}
