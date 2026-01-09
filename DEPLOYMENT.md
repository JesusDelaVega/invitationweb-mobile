# Deployment Guide - InvitationWeb Mobile

Esta guía cubre todo el proceso de deployment para iOS y Android.

## 📋 Prerequisitos

### Cuentas Requeridas
- ✅ Expo Account (gratis)
- ✅ Apple Developer Account ($99/año) - Para iOS
- ✅ Google Play Console ($25 one-time) - Para Android
- ✅ GitHub Account (para CI/CD)

### Instalación Local
```bash
npm install -g eas-cli
eas login
```

---

## 🔧 Configuración Inicial

### 1. Configurar Expo Project ID

```bash
# Login a Expo
eas login

# Inicializar proyecto en Expo
eas init

# Esto creará el projectId en app.json automáticamente
```

### 2. Actualizar app.json

Reemplazar en `app.json`:
- `your-eas-project-id` → El ID generado por `eas init`
- `your-expo-username` → Tu username de Expo
- `YOUR_GOOGLE_MAPS_API_KEY` → Tu API key de Google Maps

### 3. Configurar Credenciales

#### iOS
```bash
# Generar certificados y provisioning profiles
eas credentials

# O configurar manualmente en Apple Developer
# https://developer.apple.com
```

#### Android
```bash
# Generar keystore
eas credentials

# O usar keystore existente
```

---

## 🏗️ Build Process

### Development Build (Testing)

Para probar en dispositivos físicos:

```bash
# iOS (Simulator)
eas build --profile development --platform ios

# Android (APK)
eas build --profile development --platform android

# Instalar en dispositivo
eas build:run -p ios
eas build:run -p android
```

### Preview Build (Internal Testing)

Para TestFlight/Internal Testing:

```bash
# iOS
eas build --profile preview --platform ios

# Android
eas build --profile preview --platform android
```

### Production Build (App Stores)

Para publicar en tiendas:

```bash
# Ambas plataformas
eas build --profile production --platform all

# Solo iOS
eas build --profile production --platform ios

# Solo Android
eas build --profile production --platform android
```

---

## 📱 iOS Deployment

### Paso 1: Build

```bash
eas build --profile production --platform ios
```

### Paso 2: Submit a App Store Connect

**Opción A: Automático**
```bash
eas submit --platform ios
```

**Opción B: Manual**
1. Descargar .ipa de Expo
2. Subir a App Store Connect usando Transporter app
3. Configurar metadata en App Store Connect

### Paso 3: TestFlight (Beta Testing)

1. En App Store Connect → TestFlight
2. Agregar testers internos/externos
3. Compartir link de TestFlight

### Paso 4: App Review

1. Llenar información de la app
2. Screenshots (requerido):
   - iPhone 6.7" (1290x2796)
   - iPhone 6.5" (1284x2778)
   - iPad Pro 12.9" (2048x2732)
3. Submit for Review
4. Esperar aprobación (1-3 días)

---

## 🤖 Android Deployment

### Paso 1: Build

```bash
eas build --profile production --platform android
```

### Paso 2: Submit a Google Play

**Opción A: Automático**
```bash
eas submit --platform android
```

**Opción B: Manual**
1. Descargar .aab de Expo
2. Subir a Google Play Console
3. Configurar metadata

### Paso 3: Internal Testing

1. En Google Play Console → Testing → Internal testing
2. Crear release
3. Upload .aab
4. Agregar testers
5. Publish

### Paso 4: Production

1. Testing → Production
2. Create new release
3. Review y submit
4. Esperar aprobación (horas a días)

---

## 🔄 Updates Over-The-Air (OTA)

Con Expo Updates, puedes enviar actualizaciones sin pasar por app stores:

```bash
# Publicar update
eas update --branch production --message "Fix critical bug"

# Ver updates publicados
eas update:list

# Rollback a versión anterior
eas update:rollback
```

**Limitaciones:**
- ✅ Cambios en JavaScript/TypeScript
- ✅ Cambios en assets (imágenes, etc.)
- ❌ Cambios en código nativo
- ❌ Cambios en dependencias nativas

---

## 🚀 CI/CD con GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Stores

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - run: npm ci

      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build iOS
        run: eas build --platform ios --non-interactive --no-wait

      - name: Build Android
        run: eas build --platform android --non-interactive --no-wait
```

Agregar secret en GitHub:
- `EXPO_TOKEN` → Token de Expo (obtener con `eas build:configure`)

---

## 📊 Monitoring y Analytics

### Error Tracking (Sentry)

```bash
npm install @sentry/react-native

# Configurar en app.json
"plugins": [
  [
    "@sentry/react-native/expo",
    {
      "organization": "your-org",
      "project": "invitationweb-mobile"
    }
  ]
]
```

### Analytics (Expo)

```bash
# Ya incluido en Expo
# Ver en: https://expo.dev/accounts/[username]/projects/invitationweb/analytics
```

---

## 🔐 Secrets Management

**Nunca commitear:**
- Google Maps API Keys
- Cloudinary credentials
- Firebase config
- App Store credentials

**Usar:**
- Environment variables en EAS Build
- `eas secret:create` para credenciales

```bash
# Crear secret
eas secret:create --name GOOGLE_MAPS_API_KEY --value "your-key" --type string

# Usar en app.json
"config": {
  "googleMapsApiKey": "${GOOGLE_MAPS_API_KEY}"
}
```

---

## 📝 Checklist Pre-Deploy

### Ambas Plataformas
- [ ] Actualizar version en app.json
- [ ] Probar flujo completo end-to-end
- [ ] Verificar que IAP funciona en sandbox
- [ ] Probar modo offline
- [ ] Verificar todas las imágenes carguen
- [ ] Revisar logs de errores
- [ ] Optimizar bundle size
- [ ] Probar en dispositivos físicos

### iOS Específico
- [ ] Actualizar buildNumber
- [ ] Configurar App Store Connect
- [ ] Preparar screenshots
- [ ] Escribir App Store description
- [ ] Configurar Privacy Policy URL
- [ ] Probar en TestFlight

### Android Específico
- [ ] Actualizar versionCode
- [ ] Configurar Google Play Console
- [ ] Preparar screenshots
- [ ] Escribir Google Play description
- [ ] Configurar Privacy Policy
- [ ] Probar en Internal Testing

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Ver logs detallados
eas build --profile production --platform ios --clear-cache

# Limpiar cache local
npm run clean
rm -rf node_modules
npm install
```

### Submit Fails

```bash
# Verificar credenciales
eas credentials

# Submit manual
eas submit --platform ios --path ./path/to/build.ipa
```

### OTA Updates no se aplican

```bash
# Verificar canal
eas channel:view production

# Forzar update
# Agregar código en App.tsx para forzar check
```

---

## 📞 Soporte

- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction
- Apple Developer: https://developer.apple.com/support
- Google Play: https://support.google.com/googleplay/android-developer

---

## 🎉 Post-Launch

### Monitoreo
1. Configurar alerts en Expo
2. Configurar Sentry
3. Revisar reviews diariamente
4. Monitorear crashes

### Marketing
1. Preparar App Store screenshots
2. Crear landing page
3. Social media announcement
4. Email a usuarios web

### Iteración
1. Recolectar feedback
2. Priorizar bugs
3. Release updates regulares
4. Mantener paridad con web
