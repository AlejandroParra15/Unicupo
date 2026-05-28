/**
 * Vocabulario táctil de UniCupo.
 *
 * Centraliza las 5 firmas hápticas del producto. Toda vibración pasa
 * por aquí — no llames directamente a expo-haptics desde una pantalla.
 *
 * Respeta dos preferencias:
 *  - 'haptics_enabled' (AsyncStorage): toggle de usuario en Configuración.
 *  - AccessibilityInfo.isReduceMotionEnabled() en iOS: atenúa patrones
 *    suaves; mantiene los críticos (SOS + attentionAlert).
 *
 * `initHaptics()` debe llamarse una vez al iniciar la app (en _layout.tsx)
 * para hidratar el toggle desde AsyncStorage y leer la accesibilidad.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { AccessibilityInfo, Platform } from 'react-native';

const STORAGE_KEY = 'haptics_enabled';

let enabled = true;
let reduceMotion = false;

export async function initHaptics(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored !== null) enabled = stored === 'true';
  } catch {
    // ignore — default true
  }
  if (Platform.OS === 'ios') {
    try {
      reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
    } catch {
      reduceMotion = false;
    }
  }
}

export async function setHapticsEnabled(value: boolean): Promise<void> {
  enabled = value;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // best-effort
  }
}

export function isHapticsEnabled(): boolean {
  return enabled;
}

const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

async function impact(style: Haptics.ImpactFeedbackStyle): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.impactAsync(style);
  } catch {
    // unavailable on this device
  }
}

async function notify(type: Haptics.NotificationFeedbackType): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.notificationAsync(type);
  } catch {
    // unavailable on this device
  }
}

/**
 * Pulso largo de éxito.
 *
 * UniCupo: confirmación de reserva (`/trip/success`), publicación de
 * viaje exitosa (`/publish-trip`), vehículo registrado
 * (`/register-vehicle`), perfil completado (`/profile-setup`),
 * confirmación de asistencia desde Mis Viajes, reporte recibido
 * (`/report-success`).
 *
 * iOS: notificationAsync(Success). Android: impactAsync(Heavy).
 */
export async function successPulse(): Promise<void> {
  if (!enabled) return;
  if (Platform.OS === 'ios') {
    await notify(Haptics.NotificationFeedbackType.Success);
  } else {
    await impact(Haptics.ImpactFeedbackStyle.Heavy);
  }
}

/**
 * Dos pulsos suaves espaciados.
 *
 * UniCupo: conductor cerca del punto de recogida (al abrir
 * `/trip/active`), respuesta nueva del conductor en `/trip/chat`,
 * pasajero confirmó cupo (visto por el conductor).
 *
 * Si ReduceMotion está activo, no se ejecuta — es informativo, no
 * crítico.
 */
export async function softDoublePulse(): Promise<void> {
  if (!enabled || reduceMotion) return;
  await impact(Haptics.ImpactFeedbackStyle.Light);
  await wait(150);
  await impact(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Patrón rítmico corto-largo-corto.
 *
 * UniCupo: recordatorios de viaje próximo, notificación "califica tu
 * viaje" — disparado al tocar el item en `/notifications`.
 *
 * Si ReduceMotion está activo, no se ejecuta — es informativo.
 */
export async function rhythmicPattern(): Promise<void> {
  if (!enabled || reduceMotion) return;
  await impact(Haptics.ImpactFeedbackStyle.Light);
  await wait(100);
  await impact(Haptics.ImpactFeedbackStyle.Heavy);
  await wait(100);
  await impact(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Tres pulsos fuertes seguidos.
 *
 * UniCupo: viaje cancelado por el conductor, cambio crítico de ruta,
 * conductor no llegó. Disparado al tocar la notificación de
 * cancelación en `/notifications` y al cancelar una reserva desde
 * `/(tabs)/trips`.
 *
 * Crítico — sigue disparando bajo ReduceMotion (con intensidad
 * reducida en iOS) porque la información de seguridad es prioritaria.
 */
export async function attentionAlert(): Promise<void> {
  if (!enabled) return;
  if (Platform.OS === 'ios') {
    await notify(Haptics.NotificationFeedbackType.Warning);
    if (!reduceMotion) {
      await wait(100);
      await impact(Haptics.ImpactFeedbackStyle.Heavy);
      await wait(100);
      await impact(Haptics.ImpactFeedbackStyle.Heavy);
    }
  } else {
    await impact(Haptics.ImpactFeedbackStyle.Heavy);
    await wait(120);
    await impact(Haptics.ImpactFeedbackStyle.Heavy);
    if (!reduceMotion) {
      await wait(120);
      await impact(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }
}

/**
 * Activación de SOS por presión sostenida (3 segundos) en
 * `/trip/active`.
 *
 * Intensidad creciente Light → Medium → Heavy cada 500ms durante 3s.
 * - Si el usuario suelta antes (`cancel()`), no se dispara la alerta
 *   y `onComplete` nunca se invoca.
 * - Si completa los 3s, suena `successPulse` final como confirmación
 *   de envío y se invoca `onComplete`.
 *
 * Crítico — ignora el toggle de "Vibración háptica" porque es una
 * señal de seguridad por presión deliberada (ya pasaste el filtro UX
 * de mantener presionado 3s).
 *
 * Devuelve una función `cancel` que la pantalla debe llamar en
 * `onPressOut`. Internamente usa setInterval y limpia siempre con
 * clearInterval para no bloquear el thread JS.
 */
export function startSos(onComplete: () => void): () => void {
  const startedAt = Date.now();
  const DURATION = 3000;
  let cancelled = false;

  // Pulso inicial
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

  const interval = setInterval(() => {
    if (cancelled) return;
    const elapsed = Date.now() - startedAt;
    let style: Haptics.ImpactFeedbackStyle;
    if (elapsed < 1000) {
      style = Haptics.ImpactFeedbackStyle.Light;
    } else if (elapsed < 2000) {
      style = Haptics.ImpactFeedbackStyle.Medium;
    } else {
      style = Haptics.ImpactFeedbackStyle.Heavy;
    }
    Haptics.impactAsync(style).catch(() => {});

    if (elapsed >= DURATION) {
      clearInterval(interval);
      if (!cancelled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
          () => {},
        );
        onComplete();
      }
    }
  }, 500);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}
