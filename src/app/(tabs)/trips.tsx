import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { getTripById, type Trip } from '@/data/mock-trips';
import { attentionAlert, successPulse } from '@/services/haptics';
import { useApp, type Reservation } from '@/store/app-context';

type Filter = 'proximos' | 'activos' | 'pasados';

const isUpcoming = (r: Reservation) =>
  r.status === 'confirmed' || r.status === 'pending';
const isActive = (r: Reservation) => r.status === 'active';
const isPast = (r: Reservation) =>
  r.status === 'completed' || r.status === 'cancelled';

export default function TripsTab() {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const [filter, setFilter] = useState<Filter>('proximos');

  // Conductor mode shows published trips instead
  if (state.mode === 'conductor') {
    return <ConductorTrips insetsTop={insets.top} />;
  }

  const reservations = state.reservations;
  const upcoming = reservations.filter(isUpcoming);
  const active = reservations.filter(isActive);
  const past = reservations.filter(isPast);

  const visible =
    filter === 'proximos' ? upcoming : filter === 'activos' ? active : past;

  const openTripDetail = (id: string) =>
    router.push({ pathname: '/trip/[id]', params: { id } });

  const handleCancel = (tripId: string) =>
    Alert.alert('Cancelar reserva', '¿Seguro que quieres cancelar este viaje?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'CANCEL', tripId });
          attentionAlert();
        },
      },
    ]);

  const handleConfirmAsistencia = (tripId: string) => {
    dispatch({ type: 'CONFIRM_ATTENDANCE', tripId });
    successPulse();
    Alert.alert('Asistencia confirmada', 'Te avisaremos antes del viaje.');
  };

  const handleStartActive = (tripId: string) => {
    dispatch({ type: 'START_ACTIVE', tripId });
    router.push('/trip/active');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <UniText size={28} weight="700">
          Mis viajes
        </UniText>
        <Pressable
          onPress={() => router.push('/history')}
          hitSlop={8}
          style={styles.headerBtn}>
          <Feather name="clock" size={18} color={UniColors.primary} />
          <UniText size={13} weight="600" color={UniColors.primary}>
            Historial
          </UniText>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <FilterPill
          label={`Próximos${upcoming.length ? ` (${upcoming.length})` : ''}`}
          active={filter === 'proximos'}
          onPress={() => setFilter('proximos')}
        />
        <FilterPill
          label={`Activos${active.length ? ` (${active.length})` : ''}`}
          active={filter === 'activos'}
          onPress={() => setFilter('activos')}
        />
        <FilterPill
          label="Pasados"
          active={filter === 'pasados'}
          onPress={() => setFilter('pasados')}
        />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16, gap: 16 }}>
        {visible.length === 0 && (
          <EmptyFilter filter={filter} />
        )}

        {visible.map((res) => {
          const trip = getTripById(res.tripId);
          if (!trip) return null;
          return (
            <ReservationCard
              key={res.tripId}
              reservation={res}
              trip={trip}
              onDetails={() => openTripDetail(trip.id)}
              onCancel={() => handleCancel(trip.id)}
              onConfirm={() => handleConfirmAsistencia(trip.id)}
              onStart={() => handleStartActive(trip.id)}
            />
          );
        })}

        <Pressable style={styles.historyLink} onPress={() => router.push('/history')}>
          <UniText size={14} weight="600" color={UniColors.primary} align="center">
            Ver historial completo →
          </UniText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ConductorTrips({ insetsTop }: { insetsTop: number }) {
  const { state } = useApp();
  return (
    <View style={[styles.root, { paddingTop: insetsTop }]}>
      <View style={styles.header}>
        <UniText size={28} weight="700">
          Mis viajes publicados
        </UniText>
        <Pressable
          style={styles.headerBtn}
          onPress={() => router.push('/publish-trip')}>
          <Feather name="plus" size={18} color={UniColors.primary} />
          <UniText size={13} weight="600" color={UniColors.primary}>
            Publicar
          </UniText>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {state.publishedTrips.length === 0 && (
          <View style={styles.emptyBox}>
            <Feather name="truck" size={32} color={UniColors.gray500} />
            <UniText size={14} color={UniColors.fontSecondary} align="center">
              Aún no tienes viajes publicados
            </UniText>
            <Pressable
              style={styles.publishCta}
              onPress={() => router.push('/publish-trip')}>
              <UniText size={14} weight="600" color={UniColors.fontWhite}>
                Publicar primer viaje
              </UniText>
            </Pressable>
          </View>
        )}

        {state.publishedTrips.map((pt) => {
          const full = pt.cuposReserved >= pt.cupos;
          return (
            <View key={pt.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: full ? '#FFF3E0' : '#E8F5E9' },
                  ]}>
                  <UniText size={12} weight="600" color={full ? '#E67E22' : '#2E7D32'}>
                    {full ? 'Sin cupos' : `${pt.cupos - pt.cuposReserved} cupos libres`}
                  </UniText>
                </View>
                <UniText size={12} weight="500" color={UniColors.gray500}>
                  {pt.date}
                </UniText>
              </View>
              <UniText size={16} weight="700">
                {pt.origin} → {pt.destination}
              </UniText>
              <UniText size={13} color={UniColors.fontSecondary}>
                {pt.time} · {pt.price} · {pt.cuposReserved}/{pt.cupos} reservados
              </UniText>
              {pt.repeat && (
                <UniText size={12} weight="500" color={UniColors.gray500}>
                  Repite L M V
                </UniText>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function EmptyFilter({ filter }: { filter: Filter }) {
  const msgs: Record<Filter, string> = {
    proximos: 'No tienes viajes próximos. Busca cupos para reservar.',
    activos: 'No tienes viajes en curso ahora.',
    pasados: 'Aún no tienes viajes pasados.',
  };
  return (
    <View style={styles.emptyBox}>
      <Feather name="inbox" size={32} color={UniColors.gray500} />
      <UniText size={14} color={UniColors.fontSecondary} align="center" lineHeight={20}>
        {msgs[filter]}
      </UniText>
      {filter === 'proximos' && (
        <Pressable
          style={styles.publishCta}
          onPress={() => router.push('/(tabs)/buscar')}>
          <UniText size={14} weight="600" color={UniColors.fontWhite}>
            Buscar cupos
          </UniText>
        </Pressable>
      )}
    </View>
  );
}

function ReservationCard({
  reservation,
  trip,
  onDetails,
  onCancel,
  onConfirm,
  onStart,
}: {
  reservation: Reservation;
  trip: Trip;
  onDetails: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onStart: () => void;
}) {
  const status = reservation.status;

  if (status === 'cancelled') {
    return (
      <Pressable style={styles.card} onPress={onDetails}>
        <View style={styles.cardTopRow}>
          <View style={[styles.badge, { backgroundColor: '#FDEAEA' }]}>
            <UniText size={12} weight="600" color={UniColors.error}>
              Cancelado
            </UniText>
          </View>
        </View>
        <UniText size={16} weight="700">
          {trip.pickup} → Javeriana
        </UniText>
        <UniText size={13} color={UniColors.fontSecondary}>
          {trip.time} · {trip.driver} · {trip.price}
        </UniText>
      </Pressable>
    );
  }

  if (status === 'completed') {
    return (
      <Pressable style={styles.card} onPress={onDetails}>
        <View style={styles.cardTopRow}>
          <View style={[styles.badge, { backgroundColor: '#E8F8F5' }]}>
            <UniText size={12} weight="600" color={UniColors.primary}>
              Completado
            </UniText>
          </View>
          {reservation.rating ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Feather name="star" size={12} color="#F5A623" />
              <UniText size={12} weight="600">
                {reservation.rating}
              </UniText>
            </View>
          ) : null}
        </View>
        <UniText size={16} weight="700">
          {trip.pickup} → Javeriana
        </UniText>
        <UniText size={13} color={UniColors.fontSecondary}>
          {trip.time} · {trip.driver} · {trip.price}
        </UniText>
      </Pressable>
    );
  }

  if (status === 'active') {
    return (
      <Pressable style={styles.card} onPress={() => router.push('/trip/active')}>
        <View style={styles.cardTopRow}>
          <View style={[styles.badge, { backgroundColor: UniColors.primary }]}>
            <UniText size={12} weight="600" color={UniColors.fontWhite}>
              En curso
            </UniText>
          </View>
          <UniText size={12} weight="500" color={UniColors.gray500}>
            Ahora
          </UniText>
        </View>
        <UniText size={16} weight="700">
          {trip.pickup} → Javeriana
        </UniText>
        <UniText size={13} color={UniColors.fontSecondary}>
          {trip.driver} · {trip.time}
        </UniText>
        <UniText size={13} weight="600" color={UniColors.primary}>
          Abrir viaje →
        </UniText>
      </Pressable>
    );
  }

  if (status === 'pending') {
    return (
      <Pressable style={styles.card} onPress={onDetails}>
        <View style={styles.cardTopRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={styles.orangeDot} />
            <UniText size={12} weight="600" color="#E67E22">
              Pendiente confirmar
            </UniText>
          </View>
        </View>
        <UniText size={16} weight="700">
          {trip.pickup} → Javeriana
        </UniText>
        <UniText size={13} color={UniColors.fontSecondary}>
          {trip.time} · {trip.driver} · {trip.price}
        </UniText>
        <Pressable
          style={[styles.btnFilled, { backgroundColor: '#E67E22', width: '100%' }]}
          onPress={onConfirm}>
          <UniText size={13} weight="600" color={UniColors.fontWhite}>
            Confirmar asistencia
          </UniText>
        </Pressable>
      </Pressable>
    );
  }

  // confirmed
  return (
    <Pressable style={styles.card} onPress={onDetails}>
      <View style={styles.cardTopRow}>
        <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
          <UniText size={12} weight="600" color="#2E7D32">
            Confirmado
          </UniText>
        </View>
        <UniText size={12} weight="500" color={UniColors.gray500}>
          {trip.date === 'manana' ? 'Mañana' : 'Hoy'}
        </UniText>
      </View>
      <UniText size={16} weight="700">
        {trip.pickup} → Javeriana
      </UniText>
      <UniText size={13} color={UniColors.fontSecondary}>
        {trip.time} · {trip.driver} · {trip.price}
      </UniText>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable style={styles.btnOutline} onPress={onStart}>
          <UniText size={13} weight="600" color={UniColors.primary}>
            Iniciar viaje
          </UniText>
        </Pressable>
        <Pressable style={styles.btnFilled} onPress={onCancel}>
          <UniText size={13} weight="600" color={UniColors.fontWhite}>
            Cancelar
          </UniText>
        </Pressable>
      </View>
    </Pressable>
  );
}

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterPill, active && { backgroundColor: UniColors.primary }]}>
      <UniText
        size={14}
        weight={active ? '600' : '500'}
        color={active ? UniColors.fontWhite : UniColors.gray500}>
        {label}
      </UniText>
    </Pressable>
  );
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
    paddingTop: 4,
    paddingBottom: 12,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#E8F8F5',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  card: {
    backgroundColor: UniColors.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E67E22',
  },
  btnOutline: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: UniColors.primary,
    alignItems: 'center',
  },
  btnFilled: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
  },
  historyLink: {
    paddingVertical: 12,
  },
  emptyBox: {
    alignItems: 'center',
    gap: 12,
    padding: 32,
    borderRadius: 12,
    backgroundColor: UniColors.white,
  },
  publishCta: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: UniColors.primary,
  },
});
