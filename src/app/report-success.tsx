import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { successPulse } from '@/services/haptics';

export default function ReportSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { caseNumber } = useLocalSearchParams<{ caseNumber?: string }>();
  const case_ = caseNumber ?? 'UC-2026-0001';

  useEffect(() => {
    successPulse();
  }, []);

  const copyCase = async () => {
    try {
      await Share.share({ message: `Número de caso UniCupo: ${case_}` });
    } catch {
      Alert.alert('Número de caso', case_);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={8}>
          <Feather name="x" size={24} color={UniColors.fontPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Feather name="check" size={36} color={UniColors.primary} />
        </View>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <UniText size={26} weight="700" align="center">
            Reporte enviado
          </UniText>
          <UniText
            size={14}
            color={UniColors.fontSecondary}
            align="center"
            lineHeight={21}>
            Nuestro equipo de seguridad revisará tu caso en las próximas 24 horas y se pondrá en
            contacto contigo si necesitamos más información.
          </UniText>
        </View>

        <View style={styles.caseCard}>
          <UniText size={12} weight="500" color={UniColors.fontSecondary} style={{ letterSpacing: 0.8 }}>
            NÚMERO DE CASO
          </UniText>
          <UniText size={24} weight="700" color={UniColors.primary}>
            {case_}
          </UniText>
          <Pressable style={styles.copyBtn} onPress={copyCase}>
            <Feather name="share-2" size={14} color={UniColors.primary} />
            <UniText size={13} weight="500" color={UniColors.primary}>
              Compartir
            </UniText>
          </Pressable>
        </View>

        <View style={styles.infoBox}>
          <Feather name="info" size={16} color={UniColors.fontSecondary} />
          <UniText size={13} color={UniColors.fontSecondary} lineHeight={18} style={{ flex: 1 }}>
            Guarda este número de caso para hacer seguimiento o referirte a este reporte en el
            futuro.
          </UniText>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ width: '100%', gap: 12 }}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.replace('/(tabs)')}>
            <UniText size={15} weight="600" color={UniColors.fontWhite}>
              Volver al inicio
            </UniText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() =>
              Alert.alert(
                'Contacto directo',
                'Para casos urgentes contacta al equipo de seguridad: soporte@unicupo.co',
              )
            }>
            <UniText size={15} weight="600" color={UniColors.primary}>
              Contactar al equipo
            </UniText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.white,
  },
  topBar: {
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    paddingBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caseCard: {
    width: '100%',
    backgroundColor: UniColors.gray100,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E8F8F5',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: UniColors.gray100,
    width: '100%',
  },
  primaryBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
