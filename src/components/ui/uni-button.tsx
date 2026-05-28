import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';

import { UniColors } from '@/constants/theme';
import { UniText } from './uni-text';

type Props = PressableProps & {
  label: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function UniButton({
  label,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  style,
  ...rest
}: Props) {
  const height = size === 'lg' ? 52 : 44;
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        {
          height,
          opacity: pressed ? 0.85 : 1,
          backgroundColor: isPrimary ? UniColors.primary : 'transparent',
          borderWidth: isOutline ? 1 : 0,
          borderColor: UniColors.border,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      {...rest}>
      <UniText
        size={16}
        weight="600"
        color={isPrimary ? UniColors.fontWhite : UniColors.fontPrimary}>
        {label}
      </UniText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
