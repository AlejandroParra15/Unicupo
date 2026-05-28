import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { getTripById } from '@/data/mock-trips';
import { useAvailableCupos, useReservation } from '@/store/app-context';

export default function TripDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = getTripById(id ?? 'cm1');
  const reservation = useReservation(trip?.id ?? '');
  const cupos = useAvailableCupos(trip ?? { cupos: 0 } as never);

  if (!trip) return null;
  const isReserved = reservation && reservation.status !== 'cancelled';
  const isSoldOut = cupos === 0 && !isReserved;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
          onPress={() =>
            Alert.alert('Mapa de ruta', 'La vista de mapa estará disponible próximamente.')
          }
          hitSlop={8}>
          <UniText size={14} weight="500" color={UniColors.primary}>
            Mapa de ruta
          </UniText>
          <Feather name="map" size={18} color={UniColors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 24 }}>
        <Pressable
          style={styles.profile}
          onPress={() => router.push({ pathname: '/profile/[id]', params: { id: trip.id } })}>
          <View style={[styles.avatar, { backgroundColor: trip.avatarColor }]}>
            <UniText size={24} weight="700" color={UniColors.fontWhite}>
              {trip.initials}
            </UniText>
          </View>
          <UniText size={20} weight="700">
            {trip.driver}
          </UniText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Feather name="star" size={16} color="#F5A623" />
            <UniText size={14} weight="600">
              {trip.rating}
            </UniText>
            <UniText size={14} color={UniColors.fontSecondary}>
              (32 viajes)
            </UniText>
          </View>
          <UniText size={12} color={UniColors.primary} style={{ marginTop: 4 }}>
            Ver perfil →
          </UniText>
        </Pressable>

        <View style={styles.detailsCard}>
          <DetailRow icon="truck" label="Vehículo" value={`${trip.car} · ABC 123`} />
          <Separator />
          <DetailRow icon="clock" label="Hora" value={`Mañana ${trip.time}`} />
          <Separator />
          <DetailRow icon="map-pin" label="Ruta" value={trip.route} />
          <Separator />
          <DetailRow icon="navigation" label="Punto de recogida" value="C.C. Chipichape" />
          <Separator />
          <DetailRow
            icon="users"
            label="Cupos"
            value={`${cupos} de ${trip.cupos} disponibles`}
            valueColor={cupos === 0 ? UniColors.error : UniColors.primary}
          />
        </View>

        <View style={{ gap: 10 }}>
          <UniText size={16} weight="600">
            Reseñas recientes
          </UniText>
          <View style={styles.reviewCard}>
            <Feather name="star" size={16} color="#F5A623" />
            <UniText size={14} color={UniColors.fontSecondary} style={{ fontStyle: 'italic', flex: 1 }}>
              "Muy puntual y cuidadoso"
            </UniText>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomCta}>
        <View style={styles.priceRow}>
          <UniText size={14} color={UniColors.fontSecondary}>
            Contribución
          </UniText>
          <UniText size={22} weight="700">
            {trip.price}
          </UniText>
        </View>
        {isReserved ? (
          <Pressable
            style={({ pressed }) => [
              styles.reserveBtn,
              { backgroundColor: UniColors.gray100, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() => router.push('/(tabs)/trips')}>
            <UniText size={16} weight="600" color={UniColors.primary}>
              Ya reservaste — ver mis viajes
            </UniText>
          </Pressable>
        ) : isSoldOut ? (
          <View style={[styles.reserveBtn, { backgroundColor: UniColors.gray300 }]}>
            <UniText size={16} weight="600" color={UniColors.fontWhite}>
              Sin cupos disponibles
            </UniText>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.reserveBtn, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push(`/trip/confirm?id=${trip.id}`)}>
            <UniText size={16} weight="600" color={UniColors.fontWhite}>
              Reservar cupo
            </UniText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Feather name={icon} size={18} color={UniColors.primary} />
      <View style={{ flex: 1, gap: 2 }}>
        <UniText size={12} weight="500" color={UniColors.fontSecondary}>
          {label}
        </UniText>
        <UniText size={14} weight="500" color={valueColor ?? UniColors.fontPrimary}>
          {value}
        </UniText>
      </View>
    </View>
  );
}

function Separator() {
  return <View style={{ height: 1, backgroundColor: UniColors.border }} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.gray100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  profile: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    backgroundColor: UniColors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  reviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: UniColors.white,
  },
  bottomCta: {
    backgroundColor: UniColors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: UniColors.border,
    gap: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reserveBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
