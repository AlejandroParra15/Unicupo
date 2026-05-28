import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import {
  attentionAlert,
  rhythmicPattern,
  softDoublePulse,
  successPulse,
} from '@/services/haptics';

type Item = {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  bg: string;
  title: string;
  desc: string;
  time: string;
  onPress: () => void;
};

const withHaptic = (pattern: () => Promise<void> | void, onPress: () => void) => () => {
  pattern();
  onPress();
};

const ITEMS: Item[] = [
  {
    icon: 'check',
    iconColor: '#2E7D32',
    bg: '#E8F5E9',
    title: 'Reserva confirmada',
    desc: 'Tu cupo con Carlos Mendez para mañana 6:30 AM está confirmado.',
    time: 'hace 5 min',
    onPress: withHaptic(successPulse, () =>
      router.push({ pathname: '/trip/[id]', params: { id: 'cm1' } }),
    ),
  },
  {
    icon: 'bell',
    iconColor: '#F57C00',
    bg: '#FFF3E0',
    title: 'Recordatorio',
    desc: 'Confirma tu asistencia al viaje de mañana. Tienes 12 horas.',
    time: 'hace 1 hora',
    onPress: withHaptic(rhythmicPattern, () => router.push('/(tabs)/trips')),
  },
  {
    icon: 'star',
    iconColor: '#F9A825',
    bg: '#FFF8E1',
    title: 'Califica tu viaje',
    desc: '¿Cómo fue tu viaje con Laura Ríos?',
    time: 'hace 3 horas',
    onPress: withHaptic(rhythmicPattern, () => router.push('/trip/rate')),
  },
  {
    icon: 'x',
    iconColor: '#E74C3C',
    bg: '#FFEBEE',
    title: 'Viaje cancelado',
    desc: 'Juan Perez canceló el viaje del viernes.',
    time: 'hace 2 días',
    onPress: withHaptic(attentionAlert, () => router.push('/history')),
  },
  {
    icon: 'message-circle',
    iconColor: '#1A8A7D',
    bg: '#E0F2F1',
    title: 'Nuevo mensaje',
    desc: 'Carlos: "Llego en 5 min"',
    time: 'hace 2 días',
    onPress: withHaptic(softDoublePulse, () => router.push('/trip/chat')),
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={24} weight="700">
          Notificaciones
        </UniText>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        {ITEMS.map((item, i) => (
          <View key={i}>
            <Pressable
              style={({ pressed }) => [styles.notifRow, pressed && { opacity: 0.7 }]}
              onPress={item.onPress}>
              <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                <Feather name={item.icon} size={20} color={item.iconColor} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <UniText size={14} weight="600">
                  {item.title}
                </UniText>
                <UniText size={13} color={UniColors.fontSecondary} lineHeight={18}>
                  {item.desc}
                </UniText>
                <UniText size={11} color={UniColors.gray500}>
                  {item.time}
                </UniText>
              </View>
              <Feather name="chevron-right" size={20} color={UniColors.gray300} />
            </Pressable>
            {i < ITEMS.length - 1 && <View style={styles.sep} />}
          </View>
        ))}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  notifRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sep: {
    height: 1,
    backgroundColor: UniColors.border,
  },
});
