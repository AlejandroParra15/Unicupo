import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';

export default function ConductorHomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <Pressable
            style={styles.modoBadge}
            onPress={() => router.replace('/(tabs)')}>
            <Feather name="arrow-left" size={14} color="#FFFFFFAA" />
            <UniText size={13} weight="500" color="#FFFFFFAA">
              Modo conductor
            </UniText>
          </Pressable>
          <View style={styles.avatar}>
            <UniText size={13} weight="700" color={UniColors.fontWhite}>
              CM
            </UniText>
          </View>
        </View>
        <UniText size={28} weight="700" color={UniColors.fontWhite}>
          Tus viajes
        </UniText>
        <View style={styles.statsRow}>
          <StatCard value="32" label="viajes" />
          <StatCard value="4.8" label="rating" />
          <StatCard value="$96k" label="ganado" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <UniText size={18} weight="700">
          Viajes activos
        </UniText>

        <Pressable
          style={styles.tripCard}
          onPress={() => router.push({ pathname: '/trip/[id]', params: { id: 'cm1' } })}>
          <View style={{ gap: 4, flex: 1 }}>
            <UniText size={15} weight="600">
              Mañana · 6:30 AM
            </UniText>
            <UniText size={13} color={UniColors.fontSecondary}>
              Cafaverialejo › Javeriana
            </UniText>
          </View>
          <View style={styles.cuposBadge}>
            <UniText size={12} weight="600" color={UniColors.primary}>
              4 cupos
            </UniText>
          </View>
        </Pressable>

        <Pressable
          style={styles.tripCard}
          onPress={() => router.push({ pathname: '/trip/[id]', params: { id: 'lr1' } })}>
          <View style={{ gap: 4, flex: 1 }}>
            <UniText size={15} weight="600">
              Viernes · 4:00 PM
            </UniText>
            <UniText size={13} color={UniColors.fontSecondary}>
              Javeriana › Sur
            </UniText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name="alert-triangle" size={16} color="#F1C40F" />
            <View style={styles.cuposBadge}>
              <UniText size={12} weight="600" color={UniColors.primary}>
                5/6 reservados
              </UniText>
            </View>
          </View>
        </Pressable>

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
});
