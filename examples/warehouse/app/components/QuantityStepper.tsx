// The hero input: 56 dp stepper with quick-add chips; long-press repeats; the number pad is the fallback.
// The numeral rolls on change (180 ms, UI thread) unless the user asked for reduced motion.
import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { duration, fontFamily, radius, spacing, touch, type } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { Chip } from './Chip';

type Props = {
  value: number;
  onChange: (next: number) => void;
  unit: string;
  disabled?: boolean;
  quickAdds?: number[];
  inputAccessoryViewID?: string;
};

const REPEAT_MS = 120;

export function QuantityStepper({ value, onChange, unit, disabled = false, quickAdds = [10, 50, 100], inputAccessoryViewID }: Props) {
  const c = useTheme();
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const repeat = useRef<ReturnType<typeof setInterval> | null>(null);
  const prev = useRef(value);
  const latest = useRef(value);
  latest.current = value;

  useEffect(() => {
    if (prev.current !== value && !reduceMotion) {
      const dir = value > prev.current ? 1 : -1;
      offset.value = withSequence(withTiming(-8 * dir, { duration: 0 }), withTiming(0, { duration: duration.base }));
      opacity.value = withSequence(withTiming(0.3, { duration: 0 }), withTiming(1, { duration: duration.base }));
    }
    prev.current = value;
  }, [value, reduceMotion, offset, opacity]);

  const roll = useAnimatedStyle(() => ({ transform: [{ translateY: offset.value }], opacity: opacity.value }));

  const stopRepeat = () => {
    if (repeat.current) clearInterval(repeat.current);
    repeat.current = null;
  };
  const step = (delta: number) => onChange(Math.max(0, latest.current + delta));
  const startRepeat = (delta: number) => {
    stopRepeat();
    repeat.current = setInterval(() => step(delta), REPEAT_MS);
  };
  useEffect(() => stopRepeat, []);

  const stepButton = (label: string, delta: number) => (
    <Pressable
      onPress={() => step(delta)}
      onLongPress={() => startRepeat(delta)}
      onPressOut={stopRepeat}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={delta > 0 ? 'Tăng' : 'Giảm'}
      android_ripple={{ color: c.divider }}
      style={({ pressed }) => [styles.step, { borderColor: c.text, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 }]}
    >
      <Text style={[styles.stepLabel, { color: c.text }]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {stepButton('−', -1)}
        <View style={styles.center}>
          <Animated.View style={roll}>
            <TextInput
              value={value === 0 ? '' : String(value)}
              onChangeText={(t) => onChange(Number(t.replace(/[^0-9]/g, '')) || 0)}
              placeholder="0"
              placeholderTextColor={c.textMuted}
              keyboardType="number-pad"
              returnKeyType="done"
              inputAccessoryViewID={inputAccessoryViewID}
              editable={!disabled}
              selectTextOnFocus
              accessibilityLabel={`Số lượng, ${unit}`}
              style={[styles.value, { color: c.text, fontFamily: fontFamily.mono }]}
            />
          </Animated.View>
          <Text style={[styles.unit, { color: c.textMuted }]}>{unit}</Text>
        </View>
        {stepButton('+', 1)}
      </View>
      <View style={styles.chips}>
        {quickAdds.map((q) => (
          <Chip key={q} label={`+${q}`} onPress={() => step(q)} disabled={disabled} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.s12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.s12 },
  step: {
    width: touch.stepper,
    height: touch.stepper,
    borderWidth: 2,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: { ...type.heading, fontWeight: '500' },
  center: { flex: 1, alignItems: 'center' },
  value: { ...type.display, fontWeight: '700', textAlign: 'center', minWidth: 120, padding: 0, fontVariant: ['tabular-nums'] },
  unit: { ...type.caption, fontFamily: fontFamily.ui },
  chips: { flexDirection: 'row', gap: spacing.s8 },
});
