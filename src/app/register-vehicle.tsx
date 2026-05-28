import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { successPulse } from '@/services/haptics';

export default function RegisterVehicleScreen() {
  const insets = useSafeAreaInsets();
  const [marca, setMarca] = useState('Mazda');
  const [modelo, setModelo] = useState('Mazda 3 Sedán');
  const [placa, setPlaca] = useState('ABC-123');
  const [puestos, setPuestos] = useState(3);
  const submittedRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    successPulse();
    router.back();
    setTimeout(() => {
      Alert.alert('Vehículo guardado', 'Tu vehículo se actualizó correctamente.');
    }, 150);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={18} weight="700">
          Registrar vehículo
        </UniText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photoBox}>
          <Feather name="camera" size={32} color={UniColors.gray500} />
          <UniText size={14} weight="500" color={UniColors.gray500}>
            Foto del vehículo
          </UniText>
        </View>

        <Field label="Marca">
          <Pressable style={styles.dropdown}>
            <UniText size={15}>{marca}</UniText>
            <Feather name="chevron-down" size={20} color={UniColors.gray500} />
          </Pressable>
        </Field>

        <Field label="Modelo">
          <TextInput
            value={modelo}
            onChangeText={setModelo}
            style={styles.input}
            placeholderTextColor={UniColors.gray500}
          />
        </Field>

        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1, gap: 8 }}>
            <UniText size={14} weight="600">
              Color
            </UniText>
            <View style={styles.colorBox}>
              <View style={styles.colorDot} />
              <UniText size={15}>Gris</UniText>
            </View>
          </View>
          <View style={{ flex: 1, gap: 8 }}>
            <UniText size={14} weight="600">
              Placa
            </UniText>
            <TextInput
              value={placa}
              onChangeText={setPlaca}
              autoCapitalize="characters"
              style={styles.input}
            />
          </View>
        </View>

        <Field label="Puestos disponibles">
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[1, 2, 3, 4].map((n) => {
              const active = puestos === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => setPuestos(n)}
                  style={[
                    styles.puestoBtn,
                    active && { backgroundColor: UniColors.primary, borderColor: UniColors.primary },
                  ]}>
                  <UniText
                    size={16}
                    weight="600"
                    color={active ? UniColors.fontWhite : UniColors.fontPrimary}>
                    {n}
                  </UniText>
                </Pressable>
              );
            })}
          </View>
        </Field>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          disabled={submitting}
          style={({ pressed }) => [
            styles.saveBtn,
            { opacity: submitting ? 0.5 : pressed ? 0.85 : 1 },
          ]}
          onPress={handleSave}>
          <UniText size={16} weight="600" color={UniColors.fontWhite}>
            {submitting ? 'Guardando…' : 'Guardar vehículo'}
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
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  photoBox: {
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: UniColors.gray300,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dropdown: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    fontSize: 15,
    color: UniColors.fontPrimary,
  },
  colorBox: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: UniColors.gray300,
  },
  puestoBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  saveBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
