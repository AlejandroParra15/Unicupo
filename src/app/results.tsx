import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import {
  filterTrips,
  type DateKey,
  type Trip,
  type Zone,
} from '@/data/mock-trips';

const ZONE_LABELS: Record<Zone, string> = {
  sur: 'Sur',
  norte: 'Norte',
  centro: 'Centro',
  oeste: 'Oeste',
};

const DATE_LABELS: Record<DateKey, string> = {
  hoy: 'Hoy',
  manana: 'Mañana',
  elegir: 'Fecha elegida',
};

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const { empty, date, zone, minRating } = useLocalSearchParams<{
    empty?: string;
    date?: DateKey;
    zone?: Zone;
    minRating?: string;
  }>();

  const ratingNum = minRating ? parseInt(minRating, 10) : 0;
  const filtered = filterTrips({
    date,
    zone,
    minRating: ratingNum > 0 ? ratingNum : undefined,
  });

  const isEmpty = empty === '1' || filtered.length === 0;

  if (isEmpty) {
    return (
      <EmptyResults
        insetsTop={insets.top}
        date={date}
        zone={zone}
        applied={Boolean(date || zone || ratingNum)}
      />
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={18} weight="700">
          Resultados
        </UniText>
      </View>

      <View style={styles.filtersRow}>
        {date && (
          <View style={styles.filterPill}>
            <UniText size={13} weight="600" color={UniColors.fontWhite}>
              {DATE_LABELS[date]}
            </UniText>
          </View>
        )}
        {zone && (
          <View style={styles.filterPill}>
            <UniText size={13} weight="600" color={UniColors.fontWhite}>
              {ZONE_LABELS[zone]}
            </UniText>
          </View>
        )}
        {ratingNum > 0 && (
          <View style={[styles.filterPill, { backgroundColor: '#F5A623' }]}>
            <UniText size={13} weight="600" color={UniColors.fontWhite}>
              ★ {ratingNum}+
            </UniText>
          </View>
        )}
        <Pressable onPress={() => router.replace('/(tabs)/buscar')}>
          <UniText size={13} weight="500" color={UniColors.primary}>
            Editar
          </UniText>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8 }}>
        <UniText size={14} weight="500" color={UniColors.fontSecondary}>
          {filtered.length} {filtered.length === 1 ? 'cupo disponible' : 'cupos disponibles'}
        </UniText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, gap: 12 }}>
        {filtered.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onPress={() => router.push({ pathname: '/trip/[id]', params: { id: trip.id } })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function TripCard({ trip, onPress }: { trip: Trip; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: trip.avatarColor }]}>
        <UniText size={14} weight="700" color={UniColors.fontWhite}>
          {trip.initials}
        </UniText>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <UniText size={15} weight="700">
          {trip.driver}
        </UniText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <UniText size={12} color={UniColors.fontSecondary}>
            {trip.car}
          </UniText>
          <Feather name="star" size={12} color="#F5A623" />
          <UniText size={12} weight="500" color={UniColors.fontSecondary}>
            {trip.rating}
          </UniText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <UniText size={12} weight="600">
            {trip.time}
          </UniText>
          <UniText size={12} color={UniColors.fontSecondary}>
            {trip.route}
          </UniText>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <UniText size={16} weight="700">
          {trip.price}
        </UniText>
        <View style={[styles.cupoBadge, { backgroundColor: trip.cupoBadgeBg }]}>
          <UniText size={11} weight="600" color={trip.cupoBadgeColor}>
            {trip.cupos} cupo{trip.cupos > 1 ? 's' : ''} libre
          </UniText>
        </View>
      </View>
    </Pressable>
  );
}

function EmptyResults({
  insetsTop,
  date,
  zone,
  applied,
}: {
  insetsTop: number;
  date?: DateKey;
  zone?: Zone;
  applied: boolean;
}) {
  return (
    <View style={[styles.root, { paddingTop: insetsTop }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={18} weight="600">
          Resultados
        </UniText>
      </View>

      <View style={styles.filtersRow}>
        {applied ? (
          <>
            {zone && (
              <View style={[styles.filterPill, { paddingHorizontal: 14, paddingVertical: 6 }]}>
                <UniText size={13} weight="600" color={UniColors.fontWhite}>
                  {ZONE_LABELS[zone]}
                </UniText>
              </View>
            )}
            {date && (
              <UniText size={13} color={UniColors.fontSecondary}>
                {DATE_LABELS[date]}
              </UniText>
            )}
          </>
        ) : (
          <UniText size={13} color={UniColors.fontSecondary}>
            Sin filtros
          </UniText>
        )}
      </View>

      <View style={styles.emptyContent}>
        <View style={styles.emptyCircle}>
          <Feather name="search" size={36} color={UniColors.gray500} />
        </View>
        <UniText size={22} weight="700" align="center">
          No hay cupos{'\n'}disponibles
        </UniText>
        <UniText size={14} color={UniColors.fontSecondary} align="center" lineHeight={21}>
          No encontramos viajes que coincidan con tu búsqueda. Intenta con otros filtros o activa
          una alerta.
        </UniText>

        <View style={{ width: '100%', gap: 12, marginTop: 8 }}>
          <Pressable
            style={[styles.emptyBtn, { backgroundColor: UniColors.primary }]}
            onPress={() =>
              Alert.alert(
                'Alerta activada',
                'Te avisaremos cuando aparezcan cupos que coincidan con tu búsqueda.',
                [{ text: 'OK', onPress: () => router.replace('/(tabs)') }],
              )
            }>
            <UniText size={15} weight="600" color={UniColors.fontWhite}>
              Activar alerta de cupos
            </UniText>
          </Pressable>
          <Pressable
            style={[
              styles.emptyBtn,
              { borderWidth: 1.5, borderColor: UniColors.primary, backgroundColor: 'transparent' },
            ]}
            onPress={() => router.replace('/(tabs)/buscar')}>
            <UniText size={15} weight="600" color={UniColors.primary}>
              Modificar filtros
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: UniColors.primary,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: UniColors.white,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cupoBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  emptyContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
    gap: 16,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UniColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtn: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDemoBtn: {
    marginTop: 16,
    paddingVertical: 12,
  },
});
