import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConductorHome } from '@/components/screens/conductor-home';
import { UniText } from '@/components/ui/uni-text';
import { UniColors } from '@/constants/theme';
import { useApp } from '@/store/app-context';

export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const { state } = useApp();

  if (state.mode === 'conductor') {
    return <ConductorHome />;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <UniText size={16} weight="500" color="#FFFFFFCC">
            Hola, David
          </UniText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable
              onPress={() => router.push('/notifications')}
              hitSlop={8}
              style={styles.bellBtn}>
              <Feather name="bell" size={18} color={UniColors.fontWhite} />
              <View style={styles.bellDot} />
            </Pressable>
            <View style={styles.avatar}>
              <UniText size={14} weight="600" color={UniColors.fontWhite}>
                DP
              </UniText>
            </View>
          </View>
        </View>
        <UniText size={26} weight="700" color={UniColors.fontWhite}>
          ¿A dónde vas?
        </UniText>
        <Pressable
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/buscar')}>
          <Feather name="search" size={20} color={UniColors.gray500} />
          <UniText size={14} color={UniColors.gray500}>
            Buscar rutas o sitios...
          </UniText>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content}>
        <View style={{ gap: 12 }}>
          <UniText size={18} weight="600">
            Tus rutas frecuentes
          </UniText>
          <RouteCard
            title="Casa → Javeriana"
            sub="L-M-V · 6:30 AM"
            cupos={3}
            onPress={() => router.push('/results')}
          />
          <RouteCard
            title="Javeriana → Casa"
            sub="L-M-V · 4:00 PM"
            cupos={5}
            onPress={() => router.push('/results')}
          />
        </View>

        <View style={{ gap: 12 }}>
          <UniText size={18} weight="600">
            Cupos cercanos ahora
          </UniText>
          <Pressable
            style={styles.driverCard}
            onPress={() => router.push({ pathname: '/trip/[id]', params: { id: 'cm1' } })}>

            <View style={styles.driverAvatar}>
              <UniText size={14} weight="600" color={UniColors.fontWhite}>
                CM
              </UniText>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.driverTopRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <UniText size={15} weight="600">
                    Carlos M.
                  </UniText>
                  <Feather name="star" size={14} color="#F5A623" />
                  <UniText size={13} weight="500" color={UniColors.fontSecondary}>
                    4.5
                  </UniText>
                </View>
                <UniText size={16} weight="700" color={UniColors.primary}>
                  $3,000
                </UniText>
              </View>
              <UniText size={13} color={UniColors.fontSecondary}>
                Sale en 20 min · Sur-HUnd
              </UniText>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function RouteCard({
  title,
  sub,
  cupos,
  onPress,
}: {
  title: string;
  sub: string;
  cupos: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.routeCard} onPress={onPress}>
      <View style={{ gap: 4 }}>
        <UniText size={15} weight="600">
          {title}
        </UniText>
        <UniText size={13} color={UniColors.fontSecondary}>
          {sub}
        </UniText>
      </View>
      <View style={styles.cuposBadge}>
        <UniText size={12} weight="600" color="#2E7D32">
          {cupos} cupos
        </UniText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: UniColors.gray100,
  },
  header: {
    backgroundColor: UniColors.primaryBg,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF14',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5A623',
    borderWidth: 1,
    borderColor: UniColors.primaryBg,
  },
  searchBar: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: UniColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: UniColors.white,
  },
  cuposBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: UniColors.white,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UniColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
