import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { useApp } from '@/store/app-context';

export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const isConductor = state.mode === 'conductor';

  const completedCount = state.reservations.filter((r) => r.status === 'completed').length;
  const completedWithRating = state.reservations.filter(
    (r) => r.status === 'completed' && r.rating,
  );
  const avgRating =
    completedWithRating.length > 0
      ? (
          completedWithRating.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
          completedWithRating.length
        ).toFixed(1)
      : '4.7';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View style={{ width: 24 }} />
        <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
          <Feather name="settings" size={22} color={UniColors.fontPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHead}>
          <View style={styles.avatar}>
            <UniText size={28} weight="700" color={UniColors.fontWhite}>
              DP
            </UniText>
          </View>
          <UniText size={22} weight="700">
            David Parra
          </UniText>
          <View style={styles.verifiedRow}>
            <Feather name="check-circle" size={16} color={UniColors.primary} />
            <UniText size={13} weight="500" color={UniColors.primary}>
              Verificado · Javeriana
            </UniText>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard value={String(28 + completedCount)} label="viajes" />
          <StatCard value={avgRating} label="rating" />
          <StatCard value="6" label="meses" />
        </View>

        <View style={styles.modeToggleCard}>
          <View style={{ flex: 1, gap: 4 }}>
            <UniText size={15} weight="600">
              Modo Conductor
            </UniText>
            <UniText size={12} color={UniColors.fontSecondary}>
              {isConductor
                ? 'Publica viajes y recibe pasajeros'
                : 'Activa para publicar tus propios viajes'}
            </UniText>
          </View>
          <Switch
            value={isConductor}
            onValueChange={(v) =>
              dispatch({ type: 'SET_MODE', mode: v ? 'conductor' : 'pasajero' })
            }
            trackColor={{ false: UniColors.gray300, true: UniColors.primary }}
            thumbColor={UniColors.white}
          />
        </View>

        <View style={styles.menuCard}>
          <MenuRow
            icon="clock"
            label="Historial de viajes"
            onPress={() => router.push('/history')}
          />
          <MenuDivider />
          <MenuRow
            icon="bell"
            label="Notificaciones"
            onPress={() => router.push('/notifications')}
          />
          <MenuDivider />
          <MenuRow
            icon="alert-octagon"
            label="Reportar un problema"
            onPress={() => router.push('/report')}
          />
          {isConductor && (
            <>
              <MenuDivider />
              <MenuRow
                icon="truck"
                label="Mi vehículo"
                onPress={() => router.push('/register-vehicle')}
              />
            </>
          )}
        </View>

        <View style={{ gap: 16 }}>
          <UniText size={17} weight="700">
            Reseñas recientes
          </UniText>
          <ReviewCard
            stars={5}
            quote='"Muy puntual y buena onda!"'
            author="— Carlos M."
            time="hace 1 día"
          />
          <ReviewCard
            stars={4}
            quote='"Buen pasajero"'
            author="— Laura R."
            time="hace 3 días"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      <Feather name={icon} size={20} color={UniColors.primary} />
      <UniText size={15} weight="500" style={{ flex: 1 }}>
        {label}
      </UniText>
      <Feather name="chevron-right" size={20} color={UniColors.gray500} />
    </Pressable>
  );
}

function MenuDivider() {
  return <View style={{ height: 1, backgroundColor: UniColors.border, marginLeft: 50 }} />;
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <UniText size={24} weight="700">
        {value}
      </UniText>
      <UniText size={12} weight="500" color={UniColors.gray500}>
        {label}
      </UniText>
    </View>
  );
}

function ReviewCard({
  stars,
  quote,
  author,
  time,
}: {
  stars: number;
  quote: string;
  author: string;
  time: string;
}) {
  return (
    <View style={styles.reviewCard}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Feather
            key={i}
            name="star"
            size={16}
            color={i <= stars ? '#F5A623' : UniColors.gray300}
          />
        ))}
      </View>
      <UniText size={14} style={{ fontStyle: 'italic' }}>
        {quote}
      </UniText>
      <View style={styles.row}>
        <UniText size={12} weight="500" color={UniColors.fontSecondary}>
          {author}
        </UniText>
        <UniText size={12} color={UniColors.gray500}>
          {time}
        </UniText>
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
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 24,
  },
  profileHead: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    height: 72,
    borderRadius: 12,
    backgroundColor: UniColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  modeToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: UniColors.gray100,
  },
  menuCard: {
    backgroundColor: UniColors.gray100,
    borderRadius: 12,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: UniColors.gray100,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
