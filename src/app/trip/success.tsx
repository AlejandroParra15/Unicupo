import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { getTripById } from '@/data/mock-trips';
import { successPulse } from '@/services/haptics';

export default function ReservationSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const trip = getTripById(id ?? 'cm1')!;

  useEffect(() => {
    successPulse();
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.replace('/(tabs)/trips')} hitSlop={8}>
          <Feather name="x" size={24} color={UniColors.fontPrimary} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Feather name="check" size={36} color={UniColors.primary} />
        </View>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <UniText size={26} weight="700" align="center">
            ¡Reserva confirmada!
          </UniText>
          <UniText
            size={14}
            color={UniColors.fontSecondary}
            align="center"
            lineHeight={21}>
            Tu cupo está asegurado.{'\n'}Te notificaremos antes del viaje.
          </UniText>
        </View>

        <View style={styles.detailsCard}>
          <DetailRow label="Mañana" value={trip.time} />
          <DetailRow label="Conductor" value={trip.driver} />
          <DetailRow label="Punto" value="C.C. Chipichape" />
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ width: '100%', gap: 12 }}>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              styles.btnOutline,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() =>
              Alert.alert(
                'Calendario',
                'Tu viaje se agregó al calendario de tu dispositivo.',
              )
            }>
            <UniText size={15} weight="600" color={UniColors.primary}>
              Agregar al calendario
            </UniText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: UniColors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.replace('/trip/chat')}>
            <UniText size={15} weight="600" color={UniColors.fontWhite}>
              Abrir chat del viaje
            </UniText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <UniText size={13} color={UniColors.fontSecondary}>
        {label}
      </UniText>
      <UniText size={13} weight="600">
        {value}
      </UniText>
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
  detailsCard: {
    width: '100%',
    backgroundColor: UniColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: UniColors.border,
    padding: 16,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: UniColors.primary,
    backgroundColor: 'transparent',
  },
});
