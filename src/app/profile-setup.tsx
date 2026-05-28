import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StatusBarRow } from '@/components/ui/status-bar-row';
import { UniInput } from '@/components/ui/uni-input';
import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { successPulse } from '@/services/haptics';

type Role = 'pasajero' | 'conductor';

export default function ProfileSetupScreen() {
  const [name, setName] = useState('David Alejandro Parra');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('pasajero');

  return (
    <View style={styles.root}>
      <StatusBarRow />
      <View style={styles.content}>
        <View style={{ gap: 4 }}>
          <UniText size={26} weight="700">
            Completa tu perfil
          </UniText>
          <UniText size={14} color={UniColors.fontSecondary}>
            Paso 1 de 2
          </UniText>
        </View>

        <View style={styles.avatarWrap}>
          <View style={styles.avatarCircle}>
            <Feather name="plus" size={24} color={UniColors.primary} />
          </View>
          <UniText size={13} color={UniColors.primary}>
            Subir foto
          </UniText>
        </View>

        <View style={{ gap: 16 }}>
          <UniInput label="Nombre completo" value={name} onChangeText={setName} />
          <UniInput
            label="Teléfono"
            placeholder="+57 300 000 0000"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={{ gap: 8 }}>
          <UniText size={13} color={UniColors.fontSecondary}>
            Soy principalmente:
          </UniText>
          <View style={styles.toggle}>
            <RoleButton
              label="Pasajero"
              active={role === 'pasajero'}
              onPress={() => setRole('pasajero')}
            />
            <RoleButton
              label="Conductor"
              active={role === 'conductor'}
              onPress={() => setRole('conductor')}
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={() => {
            successPulse();
            router.replace('/(tabs)');
          }}
          style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1 }]}>
          <UniText size={16} weight="600" color={UniColors.fontWhite}>
            Continuar
          </UniText>
        </Pressable>
      </View>
    </View>
  );
}

function RoleButton({
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
        styles.roleBtn,
        active && { backgroundColor: UniColors.primary },
      ]}>
      <UniText
        size={14}
        weight={active ? '600' : '500'}
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
  content: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  avatarWrap: {
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: UniColors.border,
    overflow: 'hidden',
  },
  roleBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    height: 50,
    borderRadius: 10,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
