import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { StatusBarRow } from '@/components/ui/status-bar-row';
import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';

export default function OtpScreen() {
  const [digits, setDigits] = useState(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (i: number, value: string) => {
    const v = value.replace(/[^0-9]/g, '').slice(0, 1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 3) inputs.current[i + 1]?.focus();
  };

  return (
    <View style={styles.root}>
      <StatusBarRow />
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="mail" size={32} color={UniColors.primary} />
        </View>
        <UniText size={22} weight="700" align="center">
          Verifica tu correo
        </UniText>
        <UniText size={14} color={UniColors.fontSecondary} align="center">
          Enviamos un código a d.parra@javeriana.edu.co
        </UniText>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(ref) => {
                inputs.current[i] = ref;
              }}
              value={d}
              onChangeText={(v) => handleChange(i, v)}
              keyboardType="number-pad"
              maxLength={1}
              style={[
                styles.otpBox,
                { borderColor: d ? UniColors.primary : UniColors.border },
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={() => router.push('/profile-setup')}
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1 }]}>
          <UniText size={16} weight="600" color={UniColors.fontWhite}>
            Verificar
          </UniText>
        </Pressable>

        <UniText size={13} align="center" color={UniColors.fontSecondary}>
          Reenviar código en 0:47
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6F5F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: UniColors.fontPrimary,
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
