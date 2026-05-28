import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';

const PROBLEMS = [
  'Conducción peligrosa',
  'No llegó',
  'Cobro indebido',
  'Acoso',
  'Ruta diferente',
  'Otro',
];

function generateCaseNumber() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `UC-2026-${n}`;
}

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('Conducción peligrosa');
  const [description, setDescription] = useState('');
  const submittedRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const submitReport = () => {
    if (submittedRef.current) return;
    if (!description.trim()) {
      Alert.alert(
        'Descripción requerida',
        'Cuéntanos qué pasó para que podamos investigar el caso.',
      );
      return;
    }
    submittedRef.current = true;
    setSubmitting(true);
    const caseNumber = generateCaseNumber();
    router.replace({ pathname: '/report-success', params: { caseNumber } });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
        </Pressable>
        <UniText size={18} weight="700">
          Reportar problema
        </UniText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Feather name="alert-triangle" size={20} color={UniColors.error} />
          <UniText size={13} color={UniColors.fontPrimary} lineHeight={18} style={{ flex: 1 }}>
            Este reporte será revisado por nuestro equipo. Los datos del viaje se adjuntan
            automáticamente.
          </UniText>
        </View>

        <Field label="Viaje relacionado">
          <View style={styles.tripCard}>
            <UniText size={14} weight="500">
              Lun 15 Mar · Carlos M.
            </UniText>
            <UniText size={13} color={UniColors.fontSecondary}>
              Cañaverialejo → Javeriana
            </UniText>
          </View>
        </Field>

        <Field label="Tipo de problema">
          <View style={styles.tagsWrap}>
            {PROBLEMS.map((problem) => {
              const active = selected === problem;
              return (
                <Pressable
                  key={problem}
                  onPress={() => setSelected(problem)}
                  style={[
                    styles.tag,
                    active
                      ? { backgroundColor: UniColors.error, borderColor: UniColors.error }
                      : { borderColor: UniColors.border },
                  ]}>
                  <UniText
                    size={13}
                    weight="500"
                    color={active ? UniColors.fontWhite : UniColors.fontSecondary}>
                    {problem}
                  </UniText>
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label="Describe lo que pasó">
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Cuéntanos con detalle lo que ocurrió..."
            placeholderTextColor={UniColors.gray500}
            multiline
            style={styles.textarea}
          />
        </Field>

        <Pressable
          disabled={submitting}
          style={({ pressed }) => [
            styles.submitBtn,
            { opacity: submitting ? 0.5 : pressed ? 0.85 : 1 },
          ]}
          onPress={submitReport}>
          <UniText size={16} weight="600" color={UniColors.fontWhite}>
            {submitting ? 'Enviando…' : 'Enviar reporte'}
          </UniText>
        </Pressable>

        <View style={{ height: insets.bottom + 12 }} />
      </ScrollView>
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
    gap: 24,
  },
  banner: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FDECEC',
  },
  tripCard: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    gap: 4,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  textarea: {
    minHeight: 100,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    fontSize: 13,
    color: UniColors.fontPrimary,
    textAlignVertical: 'top',
  },
  submitBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: UniColors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
