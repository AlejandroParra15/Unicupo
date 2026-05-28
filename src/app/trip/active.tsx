import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { softDoublePulse, startSos } from '@/services/haptics';

export default function ActiveTripScreen() {
  const insets = useSafeAreaInsets();
  const sosCancelRef = useRef<(() => void) | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simula la llegada de la notificación "conductor cerca" cuando
    // abres la pantalla de viaje en curso.
    softDoublePulse();
  }, []);

  const onSosPressIn = () => {
    setSosActive(true);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
    sosCancelRef.current = startSos(() => {
      setSosActive(false);
      Alert.alert(
        'SOS enviado',
        'Alertamos al equipo de seguridad y contactos de emergencia con tu ubicación actual.',
      );
    });
  };

  const onSosPressOut = () => {
    sosCancelRef.current?.();
    sosCancelRef.current = null;
    setSosActive(false);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top + 4 }]}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/trips')}
          hitSlop={8}
          style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable
            onPressIn={onSosPressIn}
            onPressOut={onSosPressOut}
            style={[styles.sosBtn, sosActive && styles.sosBtnActive]}>
            {sosActive && (
              <Animated.View style={[styles.sosProgress, { width: progressWidth }]} />
            )}
            <Feather name="alert-octagon" size={14} color={UniColors.fontWhite} />
            <UniText size={12} weight="700" color={UniColors.fontWhite}>
              {sosActive ? 'Sigue presionando…' : 'SOS'}
            </UniText>
          </Pressable>
          <Badge label="Viaje en curso" />
        </View>
      </View>

      <View style={styles.mapArea}>
        <MapPlaceholder />
        <View style={styles.enCaminoBadge}>
          <UniText size={12} weight="600" color={UniColors.fontWhite}>
            en camino
          </UniText>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.driverCard}>
          <View style={styles.avatar}>
            <UniText size={14} weight="700" color={UniColors.fontWhite}>
              CM
            </UniText>
          </View>
          <View style={{ gap: 2, flex: 1 }}>
            <UniText size={15} weight="600">
              Carlos llega en 5 min
            </UniText>
            <UniText size={13} color={UniColors.fontSecondary}>
              C.C. Chipichape
            </UniText>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <UniText size={14} weight="600">
            Pasajeros en este viaje
          </UniText>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <PassengerAvatar initials="DP" name="David" bg="#E8D5C4" />
            <PassengerAvatar initials="S" name="Sebastián" bg="#D4E8D9" />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            style={[styles.btn, styles.btnOutline]}
            onPress={() => router.push('/trip/chat')}>
            <UniText size={15} weight="600" color={UniColors.primary}>
              Chat
            </UniText>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnFilled]}
            onPress={() =>
              Alert.alert('Finalizar viaje', '¿Confirmas que el viaje ya terminó?', [
                { text: 'Aún no', style: 'cancel' },
                { text: 'Sí, finalizar', onPress: () => router.replace('/trip/rate') },
              ])
            }>
            <UniText size={15} weight="600" color={UniColors.fontWhite}>
              Finalizar viaje
            </UniText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <View style={styles.headerBadge}>
      <UniText size={12} weight="600" color={UniColors.fontWhite}>
        {label}
      </UniText>
    </View>
  );
}

function PassengerAvatar({ initials, name, bg }: { initials: string; name: string; bg: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 4 }}>
      <View style={[styles.passengerAvatar, { backgroundColor: bg }]}>
        <UniText size={13} weight="600">
          {initials}
        </UniText>
      </View>
      <UniText size={11} color={UniColors.fontSecondary}>
        {name}
      </UniText>
    </View>
  );
}

function MapPlaceholder() {
  return (
    <View style={styles.mapBg}>
      {/* Subtle "streets" pattern with absolute lines */}
      <View style={[styles.street, { top: 60, left: 0, right: 0, height: 2 }]} />
      <View style={[styles.street, { top: 150, left: 0, right: 0, height: 2 }]} />
      <View style={[styles.street, { top: 220, left: 0, right: 0, height: 2 }]} />
      <View style={[styles.street, { top: 0, bottom: 0, left: 80, width: 2 }]} />
      <View style={[styles.street, { top: 0, bottom: 0, left: 180, width: 2 }]} />
      <View style={[styles.street, { top: 0, bottom: 0, left: 280, width: 2 }]} />
      <View style={[styles.river]} />
      <View style={styles.routeDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.gray100,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: UniColors.error,
    overflow: 'hidden',
    position: 'relative',
  },
  sosBtnActive: {
    backgroundColor: '#8E1A0E',
  },
  sosProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: UniColors.error,
  },
  headerBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: UniColors.primary,
  },
  mapArea: {
    height: 260,
    position: 'relative',
  },
  mapBg: {
    flex: 1,
    backgroundColor: '#DCEBE5',
    overflow: 'hidden',
  },
  street: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  river: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 120,
    height: 130,
    backgroundColor: '#B8DDD2',
    transform: [{ rotate: '20deg' }, { translateX: 30 }],
  },
  routeDot: {
    position: 'absolute',
    top: 110,
    left: 100,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: UniColors.primary,
    borderWidth: 3,
    borderColor: UniColors.white,
  },
  enCaminoBadge: {
    position: 'absolute',
    top: 12,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: UniColors.primary,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: UniColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 24,
    gap: 20,
    marginTop: -16,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: UniColors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: UniColors.primary,
  },
  btnFilled: {
    backgroundColor: UniColors.primary,
  },
});
