import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { UniColors } from '@/constants/theme';
import { UniText } from './uni-text';

type TabBarProps = {
  state: { index: number; routes: Array<{ key: string; name: string }> };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string) => void;
  };
};

const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  index: 'home',
  buscar: 'search',
  trips: 'map',
  profile: 'user',
};

const LABELS: Record<string, string> = {
  index: 'INICIO',
  buscar: 'BUSCAR',
  trips: 'VIAJES',
  profile: 'PERFIL',
};

export function PillTabBar({ state, navigation }: TabBarProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const active = state.index === index;
          const iconName = ICONS[route.name] ?? 'circle';
          const label = LABELS[route.name] ?? route.name.toUpperCase();
          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!active && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={[styles.tab, active && styles.tabActive]}>
              <Feather
                name={iconName}
                size={18}
                color={active ? UniColors.fontWhite : UniColors.gray500}
              />
              <UniText
                size={10}
                weight={active ? '600' : '500'}
                color={active ? UniColors.fontWhite : UniColors.gray500}
                style={{ letterSpacing: 0.5, marginTop: 4 }}>
                {label}
              </UniText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: UniColors.white,
    paddingHorizontal: 21,
    paddingTop: 12,
    paddingBottom: 21,
  },
  pill: {
    flexDirection: 'row',
    height: 62,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: UniColors.border,
    backgroundColor: UniColors.white,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  tabActive: {
    backgroundColor: UniColors.primary,
  },
});
