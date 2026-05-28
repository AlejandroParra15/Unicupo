import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { UniColors } from '@/constants/theme';
import { UniText } from './uni-text';

type Props = {
  tint?: 'light' | 'dark';
  paddingHorizontal?: number;
};

export function StatusBarRow({ tint = 'dark', paddingHorizontal = 20 }: Props) {
  const color = tint === 'light' ? UniColors.fontWhite : UniColors.fontPrimary;
  return (
    <View style={[styles.row, { paddingHorizontal }]}>
      <UniText size={15} weight="600" color={color}>
        9:41
      </UniText>
      <View style={styles.iconsGroup}>
        <Feather name="bar-chart-2" size={16} color={color} />
        <Feather name="wifi" size={16} color={color} />
        <Feather name="battery" size={18} color={color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 44,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
