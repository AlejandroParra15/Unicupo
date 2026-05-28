import { StyleSheet, Text, type TextProps } from 'react-native';

import { UniColors } from '@/constants/theme';

type Weight = '400' | '500' | '600' | '700';

type Props = TextProps & {
  size?: number;
  weight?: Weight | 'normal';
  color?: string;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
};

const weightToFont = (w?: string) => {
  switch (w) {
    case '700':
      return '700';
    case '600':
      return '600';
    case '500':
      return '500';
    default:
      return '400';
  }
};

export function UniText({
  size = 14,
  weight = '400',
  color = UniColors.fontPrimary,
  align,
  lineHeight,
  style,
  children,
  ...rest
}: Props) {
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: size,
          fontWeight: weightToFont(weight) as Weight,
          color,
          textAlign: align,
          lineHeight: lineHeight ?? size * 1.35,
        },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
});
