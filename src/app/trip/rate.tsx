import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { useApp } from '@/store/app-context';

const ALL_TAGS = ['Puntual', 'Amable', 'Seguro', 'Buen carro', 'Buena ruta'];

export default function RateTripScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { dispatch } = useApp();
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>(['Puntual', 'Amable', 'Seguro']);
  const [comment, setComment] = useState('');

  const finishTrip = (saveRating: boolean) => {
    dispatch({
      type: 'COMPLETE',
      tripId: id ?? 'cm1',
      rating: saveRating ? stars : undefined,
    });
    router.replace('/(tabs)/trips');
  };

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, gap: 20 }}
        keyboardShouldPersistTaps="handled">
        <UniText size={24} weight="700" align="center">
          ¿Cómo estuvo el viaje?
        </UniText>
        <UniText size={14} color={UniColors.fontSecondary} align="center">
          Califica a Carlos Mendez
        </UniText>

        <View style={{ alignItems: 'center', gap: 24 }}>
          <View style={styles.avatar}>
            <UniText size={20} weight="700" color={UniColors.fontWhite}>
              CM
            </UniText>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Pressable key={i} onPress={() => setStars(i)} hitSlop={4}>
                <Feather
                  name="star"
                  size={32}
                  color={i <= stars ? '#F5A623' : UniColors.gray300}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <UniText size={14} weight="600" align="center">
            Etiquetas rápidas
          </UniText>
          <View style={styles.tagsWrap}>
            {ALL_TAGS.map((tag) => {
              const active = tags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tag,
                    {
                      borderColor: active ? UniColors.primary : UniColors.border,
                    },
                  ]}>
                  <UniText
                    size={13}
                    color={active ? UniColors.primary : UniColors.fontSecondary}>
                    {tag}
                  </UniText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Comentario opcional..."
          placeholderTextColor={UniColors.gray500}
          multiline
          style={styles.commentInput}
        />
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={({ pressed }) => [styles.submitBtn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => finishTrip(true)}>
          <UniText size={16} weight="600" color={UniColors.fontWhite}>
            Enviar calificación
          </UniText>
        </Pressable>
        <Pressable onPress={() => finishTrip(false)}>
          <UniText size={13} color={UniColors.fontSecondary} align="center">
            Saltar por ahora
          </UniText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.white,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  commentInput: {
    minHeight: 80,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: UniColors.border,
    fontSize: 14,
    color: UniColors.fontPrimary,
    textAlignVertical: 'top',
  },
  bottom: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 12,
  },
  submitBtn: {
    height: 50,
    borderRadius: 10,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
