# 🔧 Configuración de Variables y Secretos

Este documento lista todas las configuraciones necesarias antes de publicar la app.

## 📋 Variables Requeridas

### 1. Expo Configuration

| Variable | Ubicación | Estado | Instrucciones |
|----------|-----------|--------|---------------|
| `projectId` | `app.json` → `extra.eas.projectId` | ⚠️ Pendiente | Se configura con `eas init` |
| `owner` | `app.json` → `owner` | ⚠️ Removido | Se configura automáticamente por EAS |

### 2. Google Maps API Key

| Variable | Ubicación | Estado | Instrucciones |
|----------|-----------|--------|---------------|
| `googleMapsApiKey` (iOS) | `app.json` → `ios.config.googleMapsApiKey` | ⚠️ Pendiente | [Ver guía](#google-maps-api-key) |
| `googleMaps.apiKey` (Android) | `app.json` → `android.config.googleMaps.apiKey` | ⚠️ Pendiente | [Ver guía](#google-maps-api-key) |

### 3. Backend API (Ya configurado en código)

| Variable | Ubicación | Estado |
|----------|-----------|--------|
| `API_URL` | `services/api.ts` | ✅ Configurado |

### 4. Assets (Iconos)

| Asset | Ubicación | Estado | Requisitos |
|-------|-----------|--------|------------|
| App Icon | `assets/images/icon.png` | ✅ Existe | 1024x1024 px |
| Adaptive Icon | `assets/images/adaptive-icon.png` | ✅ Existe | 1024x1024 px |
| Splash Screen | `assets/images/splash-icon.png` | ✅ Existe | 1284x2778 px |
| Favicon | `assets/images/favicon.png` | ✅ Existe | 48x48 px |
| Notification Icon | `assets/images/notification-icon.png` | ⚠️ Verificar | 96x96 px |

---

## 🔑 Guías de Configuración

### Google Maps API Key

**¿Para qué se usa?**: Mostrar el mapa de ubicación del evento en la invitación.

**Pasos**:

1. **Crear proyecto en Google Cloud**
   - Ve a: https://console.cloud.google.com
   - Crea un nuevo proyecto o usa uno existente

2. **Habilitar APIs**
   ```
   - Maps SDK for iOS
   - Maps SDK for Android
   ```

3. **Crear credenciales**
   - Ve a: APIs & Services → Credentials
   - Click "Create Credentials" → "API Key"
   - Copia la API Key

4. **Restringir la API Key (Recomendado)**
   - iOS: Restricción por Bundle ID (`com.invitationweb.app`)
   - Android: Restricción por Package Name (`com.invitationweb.app`)
   - También puedes restringir por SHA-1 fingerprint

5. **Actualizar app.json**
   ```bash
   # Opción 1: Manual
   # Edita app.json líneas 30 y 53

   # Opción 2: Automático
   sed -i 's/YOUR_GOOGLE_MAPS_API_KEY/TU_API_KEY_AQUI/g' app.json
   ```

**Si no tienes API Key**: La app funcionará pero sin mapa de ubicación (se mostrará solo texto).

---

### Expo Project ID

**¿Para qué se usa?**: Identificar tu proyecto en Expo para builds y updates OTA.

**Pasos**:

1. **Autenticarse**
   ```bash
   eas login
   ```

2. **Inicializar proyecto**
   ```bash
   eas init
   ```

3. **Verificar configuración**
   ```bash
   # El Project ID se guarda automáticamente en app.json
   cat app.json | grep projectId
   ```

---

## 🔐 Credenciales de Producción

### Apple Developer (iOS)

**Requisitos**:
- [ ] Apple Developer Account ($99/año)
- [ ] Certificado de distribución
- [ ] Provisioning Profile

**Configuración con EAS**:
```bash
eas credentials
# Selecciona: iOS → Production → Generar automáticamente
```

**O manual**:
1. Ve a: https://developer.apple.com/account
2. Certificates, Identifiers & Profiles
3. Create → iOS Distribution
4. Download y sube a EAS

---

### Google Play (Android)

**Requisitos**:
- [ ] Google Play Console Account ($25 única vez)
- [ ] Keystore para firmar la app

**Configuración con EAS**:
```bash
eas credentials
# Selecciona: Android → Production → Generar automáticamente
```

**Keystore automático**: EAS generará y guardará el keystore por ti.

---

## 📝 Checklist de Configuración

### Antes del primer build

- [ ] Autenticado en Expo (`eas whoami`)
- [ ] Project ID configurado (`eas init`)
- [ ] Google Maps API Key (opcional)
- [ ] Assets verificados
- [ ] Dependencias instaladas (`npm install`)

### Antes de build de producción

- [ ] Credenciales iOS configuradas
- [ ] Credenciales Android configuradas
- [ ] Version y buildNumber actualizados
- [ ] Privacy Policy URL lista
- [ ] Terms of Service URL lista

### Antes de submit a tiendas

- [ ] Screenshots preparados (varios tamaños)
- [ ] Descripciones escritas (corta y larga)
- [ ] Keywords/categorías definidos
- [ ] Contact info actualizado
- [ ] App probada end-to-end

---

## 🔒 Seguridad - NO commitear

**Nunca commitees estos archivos**:
- ❌ `.env` con API keys
- ❌ `google-services.json` (Android)
- ❌ `GoogleService-Info.plist` (iOS)
- ❌ Keystores (`.jks`, `.keystore`)
- ❌ Provisioning profiles

**Ya están en .gitignore** ✅

---

## 📞 Ayuda

Si necesitas ayuda con alguna configuración:

1. **Expo Docs**: https://docs.expo.dev/build/setup/
2. **Google Maps**: https://developers.google.com/maps/documentation
3. **Apple Developer**: https://developer.apple.com/help
4. **Google Play**: https://support.google.com/googleplay/android-developer

---

## ✅ Configuración Rápida

Para una configuración completa paso a paso, ejecuta:

```bash
bash scripts/setup.sh
```

O lee: `SETUP.md`
