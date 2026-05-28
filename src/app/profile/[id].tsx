import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { getTripById } from '@/data/mock-trips';

export default function PublicProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const driver = getTripById(id ?? 'cm1')!;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={18} weight="600">
          Perfil
        </UniText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileInfo}>
          <View style={[styles.avatar, { backgroundColor: driver.avatarColor }]}>
            <UniText size={22} weight="700" color={UniColors.fontWhite}>
              {driver.initials}
            </UniText>
          </View>
          <UniText size={22} weight="700">
            {driver.driver}
          </UniText>
          <View style={styles.verifiedRow}>
            <Feather name="check-circle" size={14} color={UniColors.primary} />
            <UniText size={12} color={UniColors.primary}>
              verificado · conductor
            </UniText>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat value="32" label="viajes" />
          <Stat value={String(driver.rating)} label="rating" />
          <Stat value="0%" label="cancelación" />
        </View>

        <Divider />

        <View style={{ gap: 6 }}>
          <UniText size={14} weight="600">
            Vehículo
          </UniText>
          <UniText size={13} color={UniColors.fontSecondary}>
            {driver.car}
          </UniText>
          <UniText size={13} color={UniColors.gray500}>
            ABC-123
          </UniText>
        </View>

        <Divider />

        <View style={{ gap: 8 }}>
          <UniText size={14} weight="600">
            Etiquetas frecuentes
          </UniText>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <TagChip label="Puntual (31)" />
            <TagChip label="Seguro (24)" />
          </View>
        </View>

        <Divider />

        <View style={{ gap: 12 }}>
          <UniText size={14} weight="600">
            Reseñas
          </UniText>
          <Review
            stars={5}
            quote='"Excelente conductor, muy puntual"'
            author="— David P."
          />
          <Review
            stars={4}
            quote='"Siempre cumple, gran ruta"'
            author="— Ana M."
          />
        </View>

        <Pressable
          style={styles.reportBtn}
          onPress={() => router.push('/report')}>
          <Feather name="flag" size={16} color={UniColors.error} />
          <UniText size={13} weight="500" color={UniColors.error}>
            Reportar usuario
          </UniText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <UniText size={22} weight="700">
        {value}
      </UniText>
      <UniText size={11} color={UniColors.gray500}>
        {label}
      </UniText>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: UniColors.border }} />;
}

function TagChip({ label }: { label: string }) {
  return (
    <View style={styles.tagChip}>
      <UniText size={12} color={UniColors.primary}>
        {label}
      </UniText>
    </View>
  );
}

function Review({ stars, quote, author }: { stars: number; quote: string; author: string }) {
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Feather
            key={i}
            name="star"
            size={14}
            color={i <= stars ? '#F5A623' : UniColors.gray300}
          />
        ))}
      </View>
      <UniText size={13} color={UniColors.fontSecondary} style={{ fontStyle: 'italic' }}>
        {quote}
      </UniText>
      <UniText size={12} color={UniColors.gray500}>
        {author}
      </UniText>
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
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 20,
  },
  profileInfo: {
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  tagChip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#E8F8F5',
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.error,
  },
});
