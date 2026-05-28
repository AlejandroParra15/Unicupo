import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { StatusBarRow } from '@/components/ui/status-bar-row';
import { UniButton } from '@/components/ui/uni-button';
import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';

export default function OnboardingScreen() {
  return (
    <View style={styles.root}>
      <StatusBarRow />
      <View style={styles.content}>
        <LinearGradient
          colors={['#E8F4F2', '#D5EBE7']}
          style={styles.illustration}>
          <Feather name="map-pin" size={64} color={UniColors.primary} />
          <UniText size={12} color={UniColors.fontSecondary} style={{ marginTop: 12 }}>
            Ilustración
          </UniText>
        </LinearGradient>
        <UniText size={26} weight="700" align="center" color={UniColors.fontPrimary}>
          Viaja seguro con tu Comunidad
        </UniText>
        <UniText
          size={14}
          align="center"
          color={UniColors.fontSecondary}
          lineHeight={21}
          style={{ paddingHorizontal: 8 }}>
          Verifica tu identidad con correo institucional y conecta con conductores de confianza
        </UniText>
        <UniButton label="Siguiente" onPress={() => router.push('/login')} />
        <Pressable onPress={() => router.push('/login')}>
          <UniText size={14} weight="500" color={UniColors.fontSecondary} align="center">
            Saltar
          </UniText>
        </Pressable>
        <Feather name="arrow-down" size={20} color={UniColors.gray300} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  illustration: {
    width: 280,
    height: 280,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
