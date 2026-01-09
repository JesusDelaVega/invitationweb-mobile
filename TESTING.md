# 🧪 Guía de Testing - InvitationWeb Mobile

Guía completa para probar la aplicación antes de publicar en las tiendas.

## 📋 Índice

1. [Testing Local con Expo Go](#testing-local-con-expo-go)
2. [Development Build](#development-build)
3. [Testing en Simuladores](#testing-en-simuladores)
4. [Testing en Dispositivos Físicos](#testing-en-dispositivos-físicos)
5. [Checklist de Testing](#checklist-de-testing)
6. [Casos de Prueba](#casos-de-prueba)

---

## 🏠 Testing Local con Expo Go

La forma más rápida de probar la app durante el desarrollo.

### Paso 1: Iniciar el servidor

```bash
cd /home/jesusdelavega/logowebmx-mobile
npm start
```

### Paso 2: Escanear QR

- **iOS**: Abre la cámara y escanea el QR
- **Android**: Abre Expo Go app y escanea el QR

### Limitaciones

⚠️ **Expo Go NO soporta**:
- In-App Purchases (IAP)
- Notificaciones push configuradas
- Algunos módulos nativos

Para probar estas features, necesitas un **Development Build**.

---

## 🔧 Development Build

Un build personalizado que incluye todas las dependencias nativas.

### Android Development Build

```bash
# Crear build (primera vez: 10-20 minutos)
eas build --profile development --platform android

# Espera a que termine...
# Recibirás un link para descargar el APK

# Instalar en tu dispositivo
# 1. Descarga el APK desde el link
# 2. Transfiere a tu Android
# 3. Instala (permite "instalar desde fuentes desconocidas")
```

### iOS Development Build

```bash
# Crear build (necesita Apple Developer Account)
eas build --profile development --platform ios

# Para instalar:
# 1. Registra tu dispositivo en Apple Developer
# 2. Descarga el .ipa
# 3. Instala con Xcode o Apple Configurator
```

### Ejecutar Development Build

```bash
# 1. Inicia el servidor
npm start

# 2. Presiona 'a' para Android o 'i' para iOS
# 3. La app se conectará automáticamente
```

---

## 📱 Testing en Simuladores

### iOS Simulator (Solo Mac)

```bash
# Verificar simuladores disponibles
xcrun simctl list devices

# Iniciar app en simulador
npm run ios

# O con Expo
npm start
# Presiona 'i' para abrir en iOS Simulator
```

### Android Emulator

```bash
# Listar emuladores
emulator -list-avds

# Iniciar emulador
emulator -avd Pixel_5_API_33

# Iniciar app en emulador
npm run android

# O con Expo
npm start
# Presiona 'a' para abrir en Android Emulator
```

---

## 📲 Testing en Dispositivos Físicos

### Opción 1: Expo Go (Rápido pero limitado)

**Android:**
1. Instala Expo Go desde Play Store
2. Ejecuta `npm start`
3. Escanea QR con Expo Go

**iOS:**
1. Instala Expo Go desde App Store
2. Ejecuta `npm start`
3. Escanea QR con la cámara

### Opción 2: Development Build (Completo)

**Android:**
```bash
# Habilita "Depuración USB" en tu Android
# Conecta por USB
adb devices

# Instala el Development Build
adb install path/to/build.apk
```

**iOS:**
```bash
# Registra tu dispositivo
eas device:create

# Crea build con tu dispositivo registrado
eas build --profile development --platform ios
```

---

## ✅ Checklist de Testing

### Testing Básico

- [ ] **Login**
  - [ ] Login con Google funciona
  - [ ] Token se guarda correctamente
  - [ ] Auto-redirect después del login
  - [ ] Logout funciona

- [ ] **Dashboard**
  - [ ] Lista de proyectos carga
  - [ ] Pull-to-refresh funciona
  - [ ] Botón "Crear proyecto" funciona
  - [ ] Estados vacío/error/loading se muestran

- [ ] **Editor**
  - [ ] Abrir proyecto existente
  - [ ] Editar título, subtítulo, descripción
  - [ ] Selector de fecha/hora funciona
  - [ ] Auto-guardado funciona (espera 2 segundos)

### Testing de Imágenes

- [ ] **Hero Image**
  - [ ] Seleccionar desde galería
  - [ ] Tomar foto con cámara
  - [ ] Preview de imagen
  - [ ] Upload y optimización
  - [ ] Progress bar se muestra

- [ ] **Gallery**
  - [ ] Seleccionar múltiples imágenes (hasta 30)
  - [ ] Grid 3x3 se muestra correctamente
  - [ ] Upload batch funciona
  - [ ] Eliminar imágenes
  - [ ] Límite de 30 imágenes se respeta

### Testing de Features

- [ ] **RSVP**
  - [ ] Toggle enable/disable
  - [ ] Selector de deadline
  - [ ] WhatsApp toggle
  - [ ] Form toggle
  - [ ] Validación (al menos un método)

- [ ] **Location**
  - [ ] Nombre del lugar
  - [ ] Dirección completa
  - [ ] Coordenadas (si Google Maps configurado)
  - [ ] Mapa se muestra (si API key presente)

- [ ] **Preview**
  - [ ] WebView carga correctamente
  - [ ] Invitación se ve bien
  - [ ] Botón "Publicar" funciona
  - [ ] Validación de plan antes de publicar

### Testing de Features Móviles

- [ ] **In-App Purchases** (Solo en Production/TestFlight)
  - [ ] Productos se cargan
  - [ ] Flow de compra completo
  - [ ] Verificación con backend
  - [ ] Restore purchases (iOS)

- [ ] **Share**
  - [ ] Share sheet nativo se abre
  - [ ] WhatsApp share funciona
  - [ ] Link se comparte correctamente
  - [ ] Otros métodos (Email, SMS, etc.)

- [ ] **Notifications** (Requiere configuración Firebase)
  - [ ] Permisos se solicitan
  - [ ] Token se registra
  - [ ] Notificaciones se reciben

- [ ] **Offline Mode**
  - [ ] Acciones se guardan en queue
  - [ ] Auto-sync cuando vuelve conexión
  - [ ] Indicador de offline

### Testing de UX

- [ ] **Performance**
  - [ ] App inicia en <3 segundos
  - [ ] Transiciones suaves
  - [ ] Sin lag al scrollear
  - [ ] Imágenes cargan rápido

- [ ] **UI/UX**
  - [ ] Botones responden al toque
  - [ ] Indicadores de loading
  - [ ] Mensajes de error claros
  - [ ] Navegación intuitiva

### Testing de Errores

- [ ] **Error Handling**
  - [ ] Error de red se maneja bien
  - [ ] 401 hace logout automático
  - [ ] Errores muestran mensaje claro
  - [ ] Error Boundary atrapa crashes

---

## 🧪 Casos de Prueba

### Caso 1: Crear Invitación Completa

1. Login con Google
2. Click "Crear Proyecto"
3. Elegir template "Boda"
4. Editar Hero:
   - Título: "María & Juan"
   - Fecha: [Fecha futura]
   - Subir foto
5. Editar Gallery:
   - Subir 5 fotos
6. Editar RSVP:
   - Enable RSVP
   - Deadline: 1 semana antes del evento
   - WhatsApp: ON
7. Editar Location:
   - Lugar: "Jardín Botanico"
   - Dirección completa
8. Preview
9. Publicar
10. Verificar invitación publicada

**Resultado esperado**: Invitación se crea, guarda, y publica exitosamente.

---

### Caso 2: Modo Offline

1. Login
2. Deshabilitar WiFi/datos
3. Intentar crear proyecto
4. Intentar editar proyecto
5. Habilitar conexión
6. Verificar que cambios se sincronizaron

**Resultado esperado**: Acciones se guardan en queue y se sincronizan al volver online.

---

### Caso 3: Límites de Plan

1. Login con cuenta Free
2. Crear 1 proyecto (draft)
3. Intentar publicar sin upgrade
4. Ver modal de upgrade
5. Verificar que no deja publicar

**Resultado esperado**: Plan Free no puede publicar, muestra modal de upgrade.

---

### Caso 4: Upload de Múltiples Imágenes

1. Login
2. Abrir proyecto
3. Gallery → Seleccionar 10 fotos
4. Observar progress bar
5. Verificar que las 10 aparecen en grid

**Resultado esperado**: Todas las imágenes se suben correctamente con progress.

---

### Caso 5: Auto-Guardado

1. Login
2. Abrir proyecto
3. Editar título
4. Esperar 3 segundos
5. Cerrar app sin guardar manual
6. Reabrir app y proyecto
7. Verificar que cambios persisten

**Resultado esperado**: Cambios se guardan automáticamente cada 2 segundos.

---

## 🐛 Testing de Bugs Conocidos

### Verificar que NO ocurren

- [ ] App no crashea al subir imagen grande (>10MB)
- [ ] Auto-guardado no hace loop infinito
- [ ] Multiple uploads no causan race conditions
- [ ] Refresh token funciona al expirar access token
- [ ] Deep links funcionan correctamente

---

## 📊 Métricas de Testing

| Métrica | Target | Cómo medir |
|---------|--------|------------|
| Startup time | <3s | Time to interactive |
| Image upload | <5s por imagen | Progress bar |
| Auto-save delay | 2s | Observar indicador |
| API response | <1s | Network tab |
| Crash rate | 0% | Error Boundary |

---

## 🔧 Troubleshooting Testing

### "Cannot connect to Metro"

```bash
# Reiniciar servidor
npm start -- --reset-cache
```

### "App no instala en dispositivo"

```bash
# Android - Verificar USB debugging
adb devices

# iOS - Verificar Trust
# Settings → General → Device Management
```

### "Imágenes no suben"

- Verifica permisos de cámara/galería
- Verifica conexión a internet
- Revisa logs: `npx react-native log-android` o `log-ios`

---

## 🚀 Antes de Producción

Checklist final antes de publicar:

- [ ] Todos los casos de prueba pasados
- [ ] Probado en Android e iOS
- [ ] Probado en múltiples tamaños de pantalla
- [ ] Performance aceptable
- [ ] 0 crashes en testing
- [ ] Error handling funciona
- [ ] Offline mode funciona

---

## 📝 Reporte de Bugs

Si encuentras un bug durante testing:

1. Anota los pasos para reproducir
2. Screenshot o video
3. Logs del dispositivo
4. Versión de la app
5. Dispositivo y OS version

---

## 📖 Recursos

- **Expo Testing**: https://docs.expo.dev/develop/development-builds/introduction/
- **React Native Debugging**: https://reactnative.dev/docs/debugging
- **EAS Build**: https://docs.expo.dev/build/introduction/

---

## 🎉 Testing Completado

Una vez que hayas completado todos los casos de prueba:

```bash
# Crear build de producción
eas build --profile production --platform all
```

¡Y estarás listo para publicar en las tiendas! 🚀
