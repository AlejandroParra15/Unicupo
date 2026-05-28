import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { StatusBarRow } from '@/components/ui/status-bar-row';
import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';

export default function SplashScreen() {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/onboarding'), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <StatusBarRow tint="light" />
      <View style={styles.center}>
        <View style={styles.shieldBg}>
          <Feather name="shield" size={44} color={UniColors.primary} />
        </View>
        <UniText size={36} weight="700" color={UniColors.fontWhite}>
          UniCupo
        </UniText>
        <UniText size={15} color={UniColors.fontWhite} style={{ opacity: 0.7 }}>
          Cupos universitarios seguros
        </UniText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.primaryBg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  shieldBg: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1A8A7D26',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
