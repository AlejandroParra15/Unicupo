import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import {
  isHapticsEnabled,
  setHapticsEnabled,
  successPulse,
} from '@/services/haptics';

const comingSoon = (feature: string) =>
  Alert.alert(feature, 'Esta sección estará disponible próximamente.');

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);
  const [haptics, setHaptics] = useState(isHapticsEnabled());

  const toggleHaptics = async (v: boolean) => {
    setHaptics(v);
    await setHapticsEnabled(v);
    if (v) successPulse(); // confirma con un pulso cuando se activa
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Feather name="chevron-left" size={24} color={UniColors.fontPrimary} />
          </Pressable>
          <UniText size={28} weight="700">
            Configuración
          </UniText>
        </View>

        <View style={styles.card}>
          <Item
            icon="edit-3"
            label="Editar perfil"
            color={UniColors.primary}
            onPress={() => router.push('/profile-setup')}
          />
          <Divider />
          <Item
            icon="bell"
            label="Notificaciones"
            color={UniColors.primary}
            onPress={() => router.push('/notifications')}
          />
          <Divider />
          <ItemToggle
            icon="moon"
            label="Modo oscuro"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <Divider />
          <ItemToggle
            icon="zap"
            label="Vibración háptica"
            value={haptics}
            onValueChange={toggleHaptics}
          />
          <Divider />
          <Item
            icon="shield"
            label="Privacidad"
            color={UniColors.gray500}
            onPress={() => comingSoon('Privacidad')}
          />
          <Divider />
          <Item
            icon="help-circle"
            label="Ayuda y FAQ"
            color={UniColors.gray500}
            onPress={() => comingSoon('Ayuda y FAQ')}
          />
        </View>

        <Pressable
          style={styles.logoutRow}
          onPress={() =>
            Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Cerrar sesión', style: 'destructive', onPress: () => router.replace('/') },
            ])
          }>
          <Feather name="log-out" size={22} color={UniColors.error} />
          <UniText size={15} weight="500" color={UniColors.error}>
            Cerrar sesión
          </UniText>
        </Pressable>

        <UniText
          size={12}
          color={UniColors.gray500}
          align="center"
          style={{ marginTop: 8 }}>
          UniCupo v1.0 · Javeriana 2026
        </UniText>
      </ScrollView>
    </View>
  );
}

function Item({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.itemRow} onPress={onPress}>
      <Feather name={icon} size={22} color={color} />
      <UniText size={15} weight="500" style={{ flex: 1 }}>
        {label}
      </UniText>
      <Feather name="chevron-right" size={20} color={UniColors.gray500} />
    </Pressable>
  );
}

function ItemToggle({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.itemRow}>
      <Feather name={icon} size={22} color={UniColors.gray500} />
      <UniText size={15} weight="500" style={{ flex: 1 }}>
        {label}
      </UniText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: UniColors.gray300, true: UniColors.primary }}
        thumbColor={UniColors.white}
      />
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: UniColors.border }} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.gray100,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    gap: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  card: {
    borderRadius: 16,
    backgroundColor: UniColors.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    height: 56,
  },
});
