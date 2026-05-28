# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Háptico

UniCupo usa retroalimentación háptica como segundo canal de comunicación
(útil cuando el usuario va caminando, manejando, o tiene TDAH y necesita
un anclaje físico al evento). El "vocabulario táctil" son **5 patrones**
centralizados en `src/services/haptics.ts` — nunca llames a
`expo-haptics` directamente desde una pantalla.

### El vocabulario

| Patrón                  | Sensación                       | Cuándo se dispara                                                                                                                                                                                                                                                                              |
| ----------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `successPulse()`        | Pulso largo de éxito            | Reserva confirmada (`/trip/success`), perfil completado (`/profile-setup`), viaje publicado (`/publish-trip`), vehículo registrado (`/register-vehicle`), reporte recibido (`/report-success`), asistencia confirmada en Mis Viajes, tap en notificación "Reserva confirmada"                  |
| `softDoublePulse()`     | Dos pulsos suaves espaciados    | Llegada a Viaje en Curso ("conductor cerca", al montar `/trip/active`), nueva respuesta del conductor en el chat (`/trip/chat`), tap en notificación "Nuevo mensaje"                                                                                                                          |
| `rhythmicPattern()`     | Corto-largo-corto               | Tap en notificación de recordatorio o de "califica tu viaje" en `/notifications`                                                                                                                                                                                                              |
| `attentionAlert()`      | Tres pulsos fuertes             | Tap en notificación "Viaje cancelado" en `/notifications`, confirmación de cancelación de reserva en `/(tabs)/trips`                                                                                                                                                                          |
| `startSos(onComplete)`  | Crescendo sostenido (3s)        | Botón SOS rojo en `/trip/active` — `onPressIn` arranca, `onPressOut` cancela si soltó antes de los 3s. Si se completan los 3s dispara un `successPulse` final como confirmación de envío.                                                                                                     |

### Preferencias y accesibilidad

- **Toggle de usuario**: Configuración → "Vibración háptica". El valor
  se persiste en AsyncStorage bajo la clave `haptics_enabled` (default
  `true`). Si está OFF, ninguna función del servicio dispara nada
  (incluido SOS).
- **Reduce Motion (iOS)**: si el usuario tiene "Reduce Motion" activo
  en Ajustes del sistema, se omiten los patrones informativos
  (`softDoublePulse`, `rhythmicPattern`). Los patrones críticos
  (`attentionAlert`, `startSos`, `successPulse`) siguen activos pero
  con intensidad reducida.

### Cómo probarlo

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

### Implementación técnica

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

### NO hacer

- No agregar hápticos a taps menores (navegación, scroll, switch de
  tab, abrir un input). Solo a los momentos listados arriba.
- No agregar patrones nuevos sin consensuarlos primero — el valor del
  vocabulario es que sea finito y aprendible.
- No usar la `Vibration` API de RN directamente; todo pasa por
  `src/services/haptics.ts`.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
