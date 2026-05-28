import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initHaptics } from '@/services/haptics';
import { AppProvider } from '@/store/app-context';

export default function RootLayout() {
  useEffect(() => {
    initHaptics();
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }} />
      </AppProvider>
    </SafeAreaProvider>
  );
}
