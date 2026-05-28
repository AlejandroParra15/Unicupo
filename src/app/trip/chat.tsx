import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { softDoublePulse } from '@/services/haptics';
import { useApp, type ChatMsg } from '@/store/app-context';

const CANNED_REPLIES = [
  'Ok, anotado',
  'Listo, gracias',
  'Voy en camino',
  'Te aviso cuando esté cerca',
  'Perfecto',
];

function currentTime() {
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${ampm}`;
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [state.chatMessages.length]);

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    dispatch({
      type: 'ADD_MSG',
      msg: { kind: 'me', text: trimmed, time: currentTime() },
    });
    setDraft('');

    // Simulated reply
    setTimeout(() => {
      const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
      dispatch({
        type: 'ADD_MSG',
        msg: {
          kind: 'them',
          author: 'Carlos',
          authorColor: UniColors.primary,
          text: reply,
          time: currentTime(),
        },
      });
      softDoublePulse();
    }, 1200 + Math.random() * 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: UniColors.gray100 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="chevron-left" size={24} color={UniColors.fontWhite} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <UniText size={18} weight="700" color={UniColors.fontWhite}>
            Chat del viaje
          </UniText>
          <UniText size={13} color="#FFFFFFCC">
            3 participantes · Mañana 6:30
          </UniText>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled">
        <UniText size={12} color={UniColors.gray500} align="center">
          Chat activo hasta 7:30 AM
        </UniText>
        {state.chatMessages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={UniColors.gray500}
          style={styles.input}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Pressable style={styles.sendBtn} onPress={sendMessage}>
          <Feather name="send" size={20} color={UniColors.fontWhite} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ msg }: { msg: ChatMsg }) {
  if (msg.kind === 'system') {
    return (
      <UniText size={13} weight="500" color={UniColors.primary} align="center">
        {msg.text}
      </UniText>
    );
  }
  if (msg.kind === 'them') {
    const isCarlos = msg.author === 'Carlos';
    return (
      <View style={{ gap: 4, alignSelf: 'flex-start', maxWidth: '85%' }}>
        <UniText size={12} weight="600" color={msg.authorColor}>
          {msg.author}
        </UniText>
        <View
          style={[
            styles.bubbleThem,
            isCarlos
              ? { backgroundColor: UniColors.primary }
              : { backgroundColor: UniColors.gray100, borderWidth: 1, borderColor: UniColors.border },
          ]}>
          <UniText
            size={14}
            color={isCarlos ? UniColors.fontWhite : UniColors.fontPrimary}>
            {msg.text}
          </UniText>
        </View>
        {msg.time && (
          <UniText size={11} color={UniColors.gray500}>
            {msg.time}
          </UniText>
        )}
      </View>
    );
  }
  return (
    <View style={{ gap: 4, alignSelf: 'flex-end', maxWidth: '85%', alignItems: 'flex-end' }}>
      <View style={styles.bubbleMe}>
        <UniText size={14} color={UniColors.fontWhite}>
          {msg.text}
        </UniText>
      </View>
      {msg.time && (
        <UniText size={11} color={UniColors.gray500}>
          {msg.time}
        </UniText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: UniColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  bubbleThem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderTopLeftRadius: 4,
  },
  bubbleMe: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderTopRightRadius: 4,
    backgroundColor: UniColors.primaryDark,
  },
  inputBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: UniColors.white,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: UniColors.gray100,
    borderWidth: 1,
    borderColor: UniColors.border,
    fontSize: 14,
    color: UniColors.fontPrimary,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
