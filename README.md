# UniCupo 🚗

**Carpooling verificado para la comunidad universitaria.** UniCupo conecta a
estudiantes y conductores de la misma universidad para compartir trayectos:
publicar un viaje, buscar cupos disponibles, reservar en uno o dos toques y
coordinar el encuentro por chat. El acceso se valida con el **correo
institucional** (OTP), de modo que cada viaje se comparte solo entre personas
del mismo ecosistema universitario.

Proyecto del Equipo UniCupo (David A. Parra · Sebastian Bonilla · Andres Rojas)
para el curso de Diseño Centrado en el Usuario — Universidad Javeriana, 2026.

## Qué resuelve

UniCupo se usa **en movimiento**: el pasajero camina hacia el punto de
recogida, el conductor está al volante, hay sol fuerte que apaga la pantalla.
El diseño parte de dos compromisos:

- **Accesibilidad cognitiva primero.** La usuaria de referencia, *Valentina*
  (TDAH y discalculia leve), abandona apps cuando la pantalla la satura o le
  exige calcular horarios. UniCupo responde con lenguaje relativo ("sale en 5
  min" en vez de "06:42"), indicadores tipo semáforo (color + ícono, nunca
  solo texto), rutas frecuentes en el Home y reservas en máximo dos toques.
  *Lo que sirve a Valentina, sirve a todos.*
- **El tacto como segundo canal.** Cuando los ojos están en la calle o en la
  vía, la información crítica se traslada del canal visual al **háptico** (ver
  abajo). Es la capa de accesibilidad que funciona sin ver, sin oír y sin leer.

Estos principios fueron validados en tres ciclos de encuestas con la comunidad
universitaria y con personas con TDAH (90% abandona apps por sobrecarga de
información; 80% prefiere un semáforo visual a la hora exacta).

## Estructura

App **Expo Router** (file-based routing) en `src/app`. Las pantallas clave:

- **Acceso:** `onboarding`, `login`, `otp` (verificación por correo
  institucional), `profile-setup`.
- **Tabs principales** (`(tabs)/`): `index` (Home con rutas frecuentes),
  `buscar`, `trips` (Mis Viajes), `profile`.
- **Flujo de viaje** (`trip/`): `confirm`, `success`, `active` (Viaje en Curso,
  con botón SOS), `chat` (mensajes predefinidos + roles diferenciados), `rate`.
- **Conductor:** `conductor`, `publish-trip`, `register-vehicle`.
- **Soporte:** `report` / `report-success` (con número de caso),
  `notifications`, `settings`, `history`.

Otras carpetas: `src/components` (UI reutilizable), `src/services`
(`haptics.ts`), `src/store` (`app-context.tsx`), `src/data` (mocks),
`src/constants` (tema).

## Empezar

```bash
npm install
npx expo start
```

Desde ahí puedes abrir la app en un [development build](https://docs.expo.dev/develop/development-builds/introduction/),
en el [emulador de Android](https://docs.expo.dev/workflow/android-studio-emulator/),
en el [simulador de iOS](https://docs.expo.dev/workflow/ios-simulator/) o en
[Expo Go](https://expo.dev/go). Para sentir los hápticos necesitas un
**dispositivo físico** (ver más abajo).

---

# Interfaces hápticas

UniCupo usa retroalimentación háptica como **segundo canal de comunicación**:
útil cuando el usuario va caminando, manejando, o tiene TDAH y necesita un
anclaje físico al evento. La idea no es decorar con vibraciones, sino mover
información del ojo al tacto en los momentos donde mirar la pantalla es difícil,
peligroso o imposible.

El "vocabulario táctil" son **5 patrones** centralizados en
`src/services/haptics.ts` — nunca llames a `expo-haptics` directamente desde
una pantalla. Que el vocabulario sea finito es lo que permite que el usuario
aprenda a reconocer cada vibración sin pensar.

## El vocabulario

| Patrón                  | Sensación                       | Cuándo se dispara                                                                                                                                                                                                                                                                              |
| ----------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `successPulse()`        | Pulso largo de éxito            | Reserva confirmada (`/trip/success`), perfil completado (`/profile-setup`), viaje publicado (`/publish-trip`), vehículo registrado (`/register-vehicle`), reporte recibido (`/report-success`), asistencia confirmada en Mis Viajes, tap en notificación "Reserva confirmada"                  |
| `softDoublePulse()`     | Dos pulsos suaves espaciados    | Llegada a Viaje en Curso ("conductor cerca", al montar `/trip/active`), nueva respuesta del conductor en el chat (`/trip/chat`), tap en notificación "Nuevo mensaje"                                                                                                                          |
| `rhythmicPattern()`     | Corto-largo-corto               | Tap en notificación de recordatorio o de "califica tu viaje" en `/notifications`                                                                                                                                                                                                              |
| `attentionAlert()`      | Tres pulsos fuertes             | Tap en notificación "Viaje cancelado" en `/notifications`, confirmación de cancelación de reserva en `/(tabs)/trips`                                                                                                                                                                          |
| `startSos(onComplete)`  | Crescendo sostenido (3s)        | Botón SOS rojo en `/trip/active` — `onPressIn` arranca, `onPressOut` cancela si soltó antes de los 3s. Si se completan los 3s dispara un `successPulse` final como confirmación de envío.                                                                                                     |

Cada patrón mapea a un evento de la app pensado para un contexto concreto: el
pulso largo cierra una acción sin que el pasajero tenga que leer; el doble pulso
suave le avisa al conductor (en el bolsillo, manejando) que alguien se sumó al
viaje; los tres pulsos fuertes son imposibles de ignorar incluso con ruido
ambiental; el crescendo del SOS confirma táctilmente la activación y deja
margen para cancelar si fue accidental.

## Preferencias y accesibilidad

- **Toggle de usuario**: Configuración → "Vibración háptica". El valor
  se persiste en AsyncStorage bajo la clave `haptics_enabled` (default
  `true`). Si está OFF, ninguna función del servicio dispara nada
  (incluido SOS).
- **Reduce Motion (iOS)**: si el usuario tiene "Reduce Motion" activo
  en Ajustes del sistema, se omiten los patrones informativos
  (`softDoublePulse`, `rhythmicPattern`). Los patrones críticos
  (`attentionAlert`, `startSos`, `successPulse`) siguen activos pero
  con intensidad reducida.

## Cómo probarlo

> El **simulador de iOS no vibra** — la háptica solo se siente en un
> dispositivo físico. En Android Studio emulator tampoco. Usa tu
> teléfono con Expo Go.

| Acción                                                                 | Patrón esperado     |
| ---------------------------------------------------------------------- | ------------------- |
| Reserva un viaje y llega a la pantalla de éxito                        | `successPulse`      |
| Activa "Modo Conductor" en Perfil y publica un viaje                   | `successPulse`      |
| Tab Viajes → "Iniciar viaje" en un confirmado (abre Viaje en Curso)    | `softDoublePulse`   |
| En Chat, envía un mensaje y espera ~1.5s la respuesta de Carlos        | `softDoublePulse`   |
| Abre Notificaciones y tap en "Recordatorio"                            | `rhythmicPattern`   |
| Abre Notificaciones y tap en "Viaje cancelado"                         | `attentionAlert`    |
| Tab Viajes → "Cancelar" en un confirmado → Sí, cancelar                | `attentionAlert`    |
| En Viaje en Curso, **mantén presionado** el botón SOS rojo 3 segundos  | crescendo + success |
| Suelta antes de los 3s                                                 | cancela sin alerta  |
| Apaga "Vibración háptica" en Configuración y repite cualquier acción   | nada                |

## Implementación técnica

- `expo-haptics ~56.0.3`. El permiso `VIBRATE` de Android lo agrega
  automáticamente el plugin — no hay nada que tocar en
  `AndroidManifest.xml`.
- `initHaptics()` se llama una vez en `src/app/_layout.tsx` para
  hidratar el toggle de AsyncStorage y leer el flag de Reduce Motion.
- Las secuencias multi-pulso se construyen con
  `Haptics.impactAsync()` + `setTimeout` (expo-haptics no acepta
  arrays raw tipo `[0, 80, 150, 80]`). El resultado se siente igual
  cross-platform.
- `startSos` devuelve una función `cancel()` que la pantalla debe
  llamar en `onPressOut`. Internamente usa un único `setInterval` que
  se limpia siempre — el thread JS no se bloquea.

## NO hacer

- No agregar hápticos a taps menores (navegación, scroll, switch de
  tab, abrir un input). Solo a los momentos listados arriba.
- No agregar patrones nuevos sin consensuarlos primero — el valor del
  vocabulario es que sea finito y aprendible.
- No usar la `Vibration` API de RN directamente; todo pasa por
  `src/services/haptics.ts`.

---

## Recursos

- [Documentación de Expo (SDK 56)](https://docs.expo.dev/versions/v56.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [expo-haptics](https://docs.expo.dev/versions/v56.0.0/sdk/haptics/)
