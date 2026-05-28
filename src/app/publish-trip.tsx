import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { successPulse } from '@/services/haptics';
import { useApp } from '@/store/app-context';

export default function PublishTripScreen() {
  const insets = useSafeAreaInsets();
  const { dispatch } = useApp();
  const [cupos, setCupos] = useState(3);
  const [repeat, setRepeat] = useState(true);
  const submittedRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePublish = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    dispatch({
      type: 'PUBLISH_TRIP',
      trip: {
        id: `pub-${Date.now()}`,
        origin: 'Cañaverialejo, Cali',
        destination: 'Universidad Javeriana',
        date: '10/03/2026',
        time: '6:30 AM',
        cupos,
        cuposReserved: 0,
        price: '$3,000',
        repeat,
      },
    });
    successPulse();
    router.back();
    setTimeout(() => {
      Alert.alert('Viaje publicado', 'Los pasajeros ya pueden reservar tu cupo.');
    }, 150);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="x" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={18} weight="700">
          Publicar viaje
        </UniText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Field label="Fecha y hora">
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={[styles.inputBox, { flex: 1 }]}>
              <Feather name="calendar" size={18} color={UniColors.gray500} />
              <UniText size={14}>10/03/2026</UniText>
            </View>
            <View style={[styles.inputBox, { flex: 1 }]}>
              <Feather name="clock" size={18} color={UniColors.gray500} />
              <UniText size={14}>6:30 AM</UniText>
            </View>
          </View>
        </Field>

        <Field label="Ruta">
          <View style={styles.inputBox}>
            <View style={[styles.dot, { backgroundColor: UniColors.primary }]} />
            <UniText size={14}>cafaverialejo, Cali</UniText>
          </View>
          <View style={styles.inputBox}>
            <View style={[styles.dot, { backgroundColor: UniColors.primary }]} />
            <UniText size={14}>universidad Javeriana</UniText>
          </View>
        </Field>

        <Field label="Punto de encuentro">
          <View style={styles.inputBox}>
            <Feather name="map-pin" size={18} color={UniColors.gray500} />
            <UniText size={14} color={UniColors.gray500}>
              C.C. Chipichape - Entrada norte
            </UniText>
          </View>
        </Field>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1, gap: 8 }}>
            <UniText size={14} weight="600">
              Cupos
            </UniText>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepBtnLeft}
                onPress={() => setCupos((c) => Math.max(1, c - 1))}>
                <Feather name="minus" size={18} color={UniColors.fontPrimary} />
              </Pressable>
              <UniText size={16} weight="600">
                {cupos}
              </UniText>
              <Pressable
                style={styles.stepBtnRight}
                onPress={() => setCupos((c) => Math.min(8, c + 1))}>
                <Feather name="plus" size={18} color={UniColors.fontWhite} />
              </Pressable>
            </View>
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            <UniText size={14} weight="600">
              Contribución $
            </UniText>
            <View style={[styles.inputBox, { paddingHorizontal: 14 }]}>
              <UniText size={14}>$3,000</UniText>
            </View>
          </View>
        </View>

        <Pressable style={styles.checkRow} onPress={() => setRepeat((v) => !v)}>
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: repeat ? UniColors.primary : 'transparent',
              },
            ]}>
            {repeat && <Feather name="check" size={14} color={UniColors.fontWhite} />}
          </View>
          <UniText size={14}>Repetir L M V</UniText>
        </Pressable>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          disabled={submitting}
          style={({ pressed }) => [
            styles.publishBtn,
            { opacity: submitting ? 0.5 : pressed ? 0.85 : 1 },
          ]}
          onPress={handlePublish}>
          <UniText size={16} weight="600" color={UniColors.fontWhite}>
            {submitting ? 'Publicando…' : 'Publicar viaje'}
          </UniText>
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <UniText size={14} weight="600">
        {label}
      </UniText>
      {children}
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
  content: {
    padding: 20,
    paddingTop: 8,
    gap: 24,
  },
  inputBox: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepper: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepBtnLeft: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: UniColors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnRight: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  publishBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
