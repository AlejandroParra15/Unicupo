import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { UniColors } from '@/constants/theme';
import { UniText } from './uni-text';

type Props = TextInputProps & {
  label?: string;
  helperText?: string;
  helperColor?: string;
};

export function UniInput({ label, helperText, helperColor, style, ...rest }: Props) {
  return (
    <View style={styles.wrap}>
      {label && (
        <UniText size={13} weight="500" color={UniColors.fontSecondary}>
          {label}
        </UniText>
      )}
      <TextInput
        placeholderTextColor={UniColors.gray500}
        style={[styles.input, style]}
        {...rest}
      />
      {helperText && (
        <UniText size={12} color={helperColor ?? UniColors.primary}>
          {helperText}
        </UniText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: UniColors.border,
    backgroundColor: UniColors.white,
    fontSize: 14,
    color: UniColors.fontPrimary,
  },
});
