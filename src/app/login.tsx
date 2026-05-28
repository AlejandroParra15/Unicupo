import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StatusBarRow } from '@/components/ui/status-bar-row';
import { UniInput } from '@/components/ui/uni-input';
import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.root}>
      <StatusBarRow />
      <View style={styles.content}>
        <View style={{ gap: 8 }}>
          <UniText size={28} weight="700">
            Iniciar sesión
          </UniText>
          <UniText size={14} color={UniColors.fontSecondary} lineHeight={20}>
            Ingresa tu correo institucional para acceder
          </UniText>
        </View>

        <UniInput
          label="Correo electrónico"
          placeholder="nombre@universidad.edu.co"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          helperText="Solo correos @universidad.edu.co"
        />

        <Pressable
          onPress={() => router.push('/otp')}
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1 }]}>
          <UniText size={16} weight="600" color={UniColors.fontWhite}>
            Enviar código
          </UniText>
        </Pressable>

        <View style={{ flex: 1 }} />

        <UniText
          size={12}
          align="center"
          color={UniColors.gray500}
          lineHeight={17}>
          Al continuar aceptas los términos y condiciones
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
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  btn: {
    height: 50,
    borderRadius: 10,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
