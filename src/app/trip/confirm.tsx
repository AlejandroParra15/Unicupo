import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { getTripById } from '@/data/mock-trips';
import { useApp } from '@/store/app-context';

export default function ConfirmReservationScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const trip = getTripById(id ?? 'cm1')!;
  const { dispatch } = useApp();
  const [accept, setAccept] = useState(true);

  const handleConfirm = () => {
    dispatch({ type: 'RESERVE', tripId: trip.id });
    router.replace(`/trip/success?id=${trip.id}`);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={18} weight="700">
          Confirmar reserva
        </UniText>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <UniText size={16} weight="700" color={UniColors.primary}>
            Resumen del viaje
          </UniText>

          <View style={styles.routeSection}>
            <View style={styles.indicators}>
              <View style={[styles.dot, { backgroundColor: UniColors.primary }]} />
              <View style={styles.dashLine} />
              <View style={[styles.dot, { backgroundColor: UniColors.error }]} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ gap: 2 }}>
                <UniText size={15} weight="600">
                  C.C. Chipichape
                </UniText>
                <UniText size={13} color={UniColors.fontSecondary}>
                  {trip.time} · Mañana
                </UniText>
              </View>
              <View style={{ height: 12 }} />
              <View style={{ gap: 2 }}>
                <UniText size={15} weight="600">
                  Universidad Javeriana
                </UniText>
                <UniText size={13} color={UniColors.fontSecondary}>
                  ~6:55 AM estimado
                </UniText>
              </View>
            </View>
          </View>

          <View style={styles.sep} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={[styles.driverAvatar, { backgroundColor: trip.avatarColor }]}>
              <UniText size={14} weight="700" color={UniColors.fontWhite}>
                {trip.initials}
              </UniText>
            </View>
            <View style={{ gap: 2 }}>
              <UniText size={15} weight="600">
                {trip.driver}
              </UniText>
              <UniText size={13} color={UniColors.fontSecondary}>
                {trip.car} · ★ {trip.rating}
              </UniText>
            </View>
          </View>

          <View style={styles.sep} />

          <View style={styles.priceRow}>
            <UniText size={14} color={UniColors.fontSecondary}>
              Contribución por cupo
            </UniText>
            <UniText size={14}>{trip.price}</UniText>
          </View>
          <View style={styles.priceRow}>
            <UniText size={15} weight="700">
              Total a pagar
            </UniText>
            <UniText size={15} weight="700">
              {trip.price}
            </UniText>
          </View>
        </View>

        <Pressable
          style={styles.checkRow}
          onPress={() => setAccept((v) => !v)}>
          <View
            style={[
              styles.checkbox,
              { backgroundColor: accept ? UniColors.primary : 'transparent', borderColor: accept ? UniColors.primary : UniColors.gray300 },
            ]}>
            {accept && <Feather name="check" size={14} color={UniColors.fontWhite} />}
          </View>
          <UniText
            size={12}
            color={UniColors.fontSecondary}
            lineHeight={17}
            style={{ flex: 1 }}>
            Acepto que la contribución se paga directamente al conductor
          </UniText>
        </Pressable>

        <View style={{ flex: 1 }} />

        <Pressable
          disabled={!accept}
          style={({ pressed }) => [
            styles.confirmBtn,
            { opacity: !accept ? 0.5 : pressed ? 0.85 : 1 },
          ]}
          onPress={handleConfirm}>
          <UniText size={16} weight="700" color={UniColors.fontWhite}>
            Confirmar reserva
          </UniText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  card: {
    backgroundColor: UniColors.white,
    borderRadius: 16,
    padding: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 12,
    elevation: 3,
  },
  routeSection: {
    flexDirection: 'row',
    gap: 12,
  },
  indicators: {
    width: 12,
    paddingVertical: 4,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dashLine: {
    width: 2,
    height: 28,
    backgroundColor: UniColors.primary,
    opacity: 0.4,
  },
  sep: {
    height: 1,
    backgroundColor: UniColors.border,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
