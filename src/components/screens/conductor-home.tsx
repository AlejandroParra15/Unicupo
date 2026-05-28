import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { useApp } from '@/store/app-context';

export function ConductorHome() {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const totalCupos = state.publishedTrips.reduce((s, t) => s + t.cupos, 0);
  const totalReserved = state.publishedTrips.reduce((s, t) => s + t.cuposReserved, 0);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => dispatch({ type: 'SET_MODE', mode: 'pasajero' })}
            style={styles.modoBadge}>
            <Feather name="arrow-left" size={14} color="#FFFFFFAA" />
            <UniText size={13} weight="500" color="#FFFFFFAA">
              Modo conductor
            </UniText>
          </Pressable>
          <View style={styles.avatar}>
            <UniText size={13} weight="700" color={UniColors.fontWhite}>
              DP
            </UniText>
          </View>
        </View>
        <UniText size={28} weight="700" color={UniColors.fontWhite}>
          Tus viajes
        </UniText>
        <View style={styles.statsRow}>
          <StatCard value={String(state.publishedTrips.length)} label="publicados" />
          <StatCard value="4.8" label="rating" />
          <StatCard value={`${totalReserved}/${totalCupos}`} label="reservados" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <UniText size={18} weight="700">
          Viajes activos
        </UniText>

        {state.publishedTrips.length === 0 && (
          <View style={styles.emptyBox}>
            <UniText size={14} color={UniColors.fontSecondary} align="center">
              Aún no has publicado viajes
            </UniText>
          </View>
        )}

        {state.publishedTrips.map((pt) => {
          const full = pt.cuposReserved >= pt.cupos;
          return (
            <View key={pt.id} style={styles.tripCard}>
              <View style={{ gap: 4, flex: 1 }}>
                <UniText size={15} weight="600">
                  {pt.date} · {pt.time}
                </UniText>
                <UniText size={13} color={UniColors.fontSecondary}>
                  {pt.origin} › {pt.destination}
                </UniText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {full && <Feather name="alert-triangle" size={16} color="#F1C40F" />}
                <View style={styles.cuposBadge}>
                  <UniText size={12} weight="600" color={UniColors.primary}>
                    {pt.cuposReserved}/{pt.cupos}
                  </UniText>
                </View>
              </View>
            </View>
          );
        })}

        <Pressable
          style={styles.publishBtn}
          onPress={() => router.push('/publish-trip')}>
          <Feather name="plus" size={18} color={UniColors.fontWhite} />
          <UniText size={15} weight="600" color={UniColors.fontWhite}>
            Publicar nuevo viaje
          </UniText>
        </Pressable>

        <Pressable
          style={styles.vehicleBtn}
          onPress={() => router.push('/register-vehicle')}>
          <Feather name="truck" size={18} color={UniColors.primary} />
          <UniText size={14} weight="600" color={UniColors.primary}>
            Mi vehículo
          </UniText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <UniText size={24} weight="700" color={UniColors.fontWhite}>
        {value}
      </UniText>
      <UniText size={12} weight="500" color="#FFFFFF99">
        {label}
      </UniText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.gray100,
  },
  header: {
    backgroundColor: UniColors.primaryBg,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: UniColors.primaryDark,
    alignItems: 'center',
    gap: 4,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  tripCard: {
    backgroundColor: UniColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  cuposBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#E6F5F3',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: UniColors.primary,
    marginTop: 8,
  },
  vehicleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: UniColors.primary,
  },
  emptyBox: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: UniColors.white,
  },
});
