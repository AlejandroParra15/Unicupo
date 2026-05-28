import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';

type Filter = 'todos' | 'pasajero' | 'conductor';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('todos');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={{ paddingVertical: 4 }}>
          <Feather name="arrow-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={24} weight="700">
          Historial de viajes
        </UniText>
        <View style={styles.tabs}>
          {(['todos', 'pasajero', 'conductor'] as const).map((opt) => {
            const active = filter === opt;
            return (
              <Pressable
                key={opt}
                style={[styles.tab, active && { backgroundColor: UniColors.primary }]}
                onPress={() => setFilter(opt)}>
                <UniText
                  size={13}
                  weight={active ? '600' : '500'}
                  color={active ? UniColors.fontWhite : UniColors.fontSecondary}>
                  {opt[0].toUpperCase() + opt.slice(1)}
                </UniText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16, gap: 16 }}>
        <UniText size={11} weight="600" color={UniColors.gray500} style={{ letterSpacing: 0.5 }}>
          ESTA SEMANA
        </UniText>
        <TripHistoryCard
          tripId="cm1"
          date="Lun 15 Mar · 6:30 AM"
          status="Completado"
          statusColor={UniColors.primary}
          statusBg="#E8F8F5"
          route="Cafaverialejo → Javeriana"
          driver="Con Carlos M. · ★ 4.8"
          price="$3,000"
        />
        <TripHistoryCard
          tripId="jp1"
          date="Vie 12 Mar · 4:00 PM"
          status="Cancelado"
          statusColor={UniColors.error}
          statusBg="#FDEAEA"
          route="Javeriana → Sur"
          driver="Con Juan P."
          link="Re reservar"
        />

        <UniText
          size={11}
          weight="600"
          color={UniColors.gray500}
          style={{ letterSpacing: 0.5, marginTop: 4 }}>
          SEMANA PASADA
        </UniText>
        <TripHistoryCard
          tripId="lr1"
          date="Mié 10 Mar · 6:45 AM"
          status="Completado"
          statusColor={UniColors.primary}
          statusBg="#E8F8F5"
          route="San Fernando → Javeriana"
          driver="Con Laura R. · ★ 4.6"
          price="$3,500"
        />
      </ScrollView>
    </View>
  );
}

function TripHistoryCard({
  tripId,
  date,
  status,
  statusColor,
  statusBg,
  route,
  driver,
  price,
  link,
}: {
  tripId: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  route: string;
  driver: string;
  price?: string;
  link?: string;
}) {
  const openDetail = () =>
    router.push({ pathname: '/trip/[id]', params: { id: tripId } });
  return (
    <Pressable style={styles.card} onPress={openDetail}>
      <View style={styles.row}>
        <UniText size={13} weight="600">
          {date}
        </UniText>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <UniText size={11} weight="600" color={statusColor}>
            {status}
          </UniText>
        </View>
      </View>
      <UniText size={13} color={UniColors.fontSecondary}>
        {route}
      </UniText>
      <View style={styles.row}>
        <UniText size={12} color={UniColors.gray500}>
          {driver}
        </UniText>
        {price && (
          <UniText size={14} weight="600">
            {price}
          </UniText>
        )}
      </View>
      {link && (
        <Pressable onPress={openDetail} hitSlop={6}>
          <UniText size={12} weight="600" color={UniColors.primary}>
            {link}
          </UniText>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.gray100,
  },
  header: {
    backgroundColor: UniColors.white,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  tabs: {
    flexDirection: 'row',
    height: 36,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  card: {
    backgroundColor: UniColors.white,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
