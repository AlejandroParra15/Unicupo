import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { useApp } from '@/store/app-context';

type DateOption = 'hoy' | 'manana' | 'elegir';
type Zone = 'sur' | 'norte' | 'centro' | 'oeste';

export default function BuscarTab() {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('Universidad Javeriana');
  const [date, setDate] = useState<DateOption>('hoy');
  const [zone, setZone] = useState<Zone>('sur');
  const [rating, setRating] = useState(3);

  // In conductor mode, this tab becomes "Publicar"
  if (state.mode === 'conductor') {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <UniText size={18} weight="700">
            Publicar
          </UniText>
        </View>
        <View style={styles.conductorEmpty}>
          <Feather name="plus-circle" size={48} color={UniColors.primary} />
          <UniText size={18} weight="700" align="center">
            Publica un nuevo viaje
          </UniText>
          <UniText
            size={14}
            color={UniColors.fontSecondary}
            align="center"
            lineHeight={20}>
            Define ruta, hora y cupos para que los pasajeros puedan reservar contigo.
          </UniText>
          <Pressable
            style={styles.searchBtn}
            onPress={() => router.push('/publish-trip')}>
            <UniText size={16} weight="600" color={UniColors.fontWhite}>
              Crear viaje
            </UniText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={18} weight="700">
          Buscar cupos
        </UniText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Field label="Origen">
          <View style={styles.inputBox}>
            <Feather name="search" size={20} color={UniColors.gray500} />
            <TextInput
              placeholder="¿Desde dónde sales?"
              placeholderTextColor={UniColors.gray500}
              value={origen}
              onChangeText={setOrigen}
              style={styles.input}
            />
          </View>
        </Field>

        <Field label="Destino">
          <View style={styles.inputBox}>
            <Feather name="map-pin" size={20} color={UniColors.primary} />
            <TextInput
              value={destino}
              onChangeText={setDestino}
              style={styles.input}
            />
          </View>
        </Field>

        <Field label="Fecha">
          <View style={styles.pillRow}>
            <Pill label="Hoy" active={date === 'hoy'} onPress={() => setDate('hoy')} />
            <Pill label="Mañana" active={date === 'manana'} onPress={() => setDate('manana')} />
            <Pill label="Elegir" active={date === 'elegir'} onPress={() => setDate('elegir')} />
          </View>
        </Field>

        <Field label="Rango de hora">
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={[styles.inputBox, { flex: 1 }]}>
              <Feather name="clock" size={18} color={UniColors.gray500} />
              <UniText size={14}>8:00 AM</UniText>
            </View>
            <View style={[styles.inputBox, { flex: 1 }]}>
              <Feather name="clock" size={18} color={UniColors.gray500} />
              <UniText size={14}>8:00 AM</UniText>
            </View>
          </View>
        </Field>

        <Field label="Zona preferida">
          <View style={styles.pillRow}>
            <Pill label="Sur" active={zone === 'sur'} onPress={() => setZone('sur')} />
            <Pill label="Norte" active={zone === 'norte'} onPress={() => setZone('norte')} />
            <Pill label="Centro" active={zone === 'centro'} onPress={() => setZone('centro')} />
            <Pill label="Oeste" active={zone === 'oeste'} onPress={() => setZone('oeste')} />
          </View>
        </Field>

        <Field label="Calificación mínima">
          <View style={styles.ratingRow}>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setRating((r) => Math.max(0, r - 1))}>
                <Feather name="minus" size={18} color={UniColors.gray500} />
              </Pressable>
              <UniText size={16} weight="600">
                {rating}+
              </UniText>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setRating((r) => Math.min(5, r + 1))}>
                <Feather name="plus" size={18} color={UniColors.fontPrimary} />
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Feather
                  key={i}
                  name="star"
                  size={20}
                  color={i < 4 ? '#F5A623' : UniColors.gray300}
                />
              ))}
            </View>
            <UniText size={14} weight="600">
              4.5
            </UniText>
          </View>
        </Field>
      </ScrollView>

      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [styles.searchBtn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() =>
            router.push({
              pathname: '/results',
              params: {
                date,
                zone,
                minRating: String(rating),
              },
            })
          }>
          <UniText size={16} weight="600" color={UniColors.fontWhite}>
            Buscar cupos
          </UniText>
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <UniText size={14} weight="600">
        {label}
      </UniText>
      {children}
    </View>
  );
}

function Pill({
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
      style={[
        styles.pill,
        active
          ? { backgroundColor: UniColors.primary, borderColor: UniColors.primary }
          : { borderColor: UniColors.gray300 },
      ]}>
      <UniText
        size={14}
        weight="500"
        color={active ? UniColors.fontWhite : UniColors.fontSecondary}>
        {label}
      </UniText>
    </Pressable>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    gap: 24,
  },
  inputBox: {
    height: 48,
    borderRadius: 10,
    backgroundColor: UniColors.gray100,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: UniColors.fontPrimary,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  pill: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UniColors.gray100,
    borderRadius: 10,
    height: 40,
  },
  stepBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    padding: 20,
    paddingTop: 12,
  },
  conductorEmpty: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  searchBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
