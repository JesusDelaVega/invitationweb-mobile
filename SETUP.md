# 🚀 Configuración de InvitationWeb Mobile

Guía paso a paso para configurar y publicar la app en App Store y Play Store.

## ✅ Completado hasta ahora

- ✅ Código de la app completo (100%)
- ✅ Repositorio en GitHub creado
- ✅ EAS CLI instalado
- ✅ Configuración base en app.json y eas.json

---

## 📋 Pasos para Publicar

### 1️⃣ Autenticarse en Expo (REQUERIDO)

```bash
cd /home/jesusdelavega/logowebmx-mobile

# Autenticarse con tu cuenta Expo
eas login

# Si no tienes cuenta, créala en: https://expo.dev/signup
```

**Importante**: Necesitas crear una cuenta en Expo si no tienes una. Es gratis.

---

### 2️⃣ Inicializar Proyecto en Expo

```bash
# Esto creará el Project ID automáticamente
eas init

# Responde:
# - ¿Crear nuevo proyecto? → Sí
# - Nombre del proyecto: invitationweb-mobile
```

Este comando actualizará automáticamente `app.json` con tu:
- Project ID
- Username de Expo

---

### 3️⃣ Configurar Google Maps API Key (OPCIONAL pero recomendado)

Para que funcione el mapa de ubicación del evento:

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Crea un proyecto o usa uno existente
3. Habilita "Maps SDK for iOS" y "Maps SDK for Android"
4. Crea una API Key
5. Actualiza `app.json` líneas 30 y 53:

```bash
# Editar app.json
sed -i 's/YOUR_GOOGLE_MAPS_API_KEY/TU_API_KEY_AQUI/g' app.json
```

**Si no tienes API Key**: La app funcionará pero sin mapa de ubicación.

---

### 4️⃣ Crear Assets de la App (Iconos)

Necesitas crear los iconos de la app. Opciones:

**Opción A: Usar un generador online**
1. Ve a: https://www.appicon.co o https://easyappicon.com
2. Sube tu logo (1024x1024 px)
3. Descarga los assets generados

**Opción B: Usar el template de Expo**
```bash
# Los assets por defecto ya están en:
# ./assets/images/icon.png (512x512)
# ./assets/images/adaptive-icon.png (1024x1024)
# ./assets/images/splash-icon.png (1284x2778)

# Si quieres reemplazarlos, pon tus imágenes ahí
```

---

### 5️⃣ Build de Desarrollo (Probar primero)

```bash
# Android (más rápido para probar)
eas build --profile development --platform android

# Esto tomará 10-20 minutos
# Al finalizar, te dará un link para descargar el APK
```

Instala el APK en tu celular y prueba:
- ✅ Login con Google
- ✅ Crear proyecto
- ✅ Subir imágenes
- ✅ Preview de invitación
- ✅ Publicar invitación

---

### 6️⃣ Configurar Credenciales de Producción

#### Para iOS (Necesitas Apple Developer Account - $99/año):

```bash
# Generar certificados y provisioning profiles
eas credentials

# O configurar manualmente en:
# https://developer.apple.com/account
```

#### Para Android (Necesitas Google Play Console - $25 única vez):

```bash
# EAS generará el keystore automáticamente
# O puedes usar uno existente con:
eas credentials
```

---

### 7️⃣ Build de Producción

```bash
# Ambas plataformas
eas build --profile production --platform all

# O por separado:
eas build --profile production --platform ios
eas build --profile production --platform android
```

Esto tomará 15-30 minutos por plataforma.

---

### 8️⃣ Submit a las Tiendas

#### App Store (iOS):

```bash
# Submit automático
eas submit --platform ios

# O manual:
# 1. Descarga el .ipa
# 2. Usa Transporter app (Mac)
# 3. Configura en App Store Connect
```

**Requisitos App Store:**
- Screenshots (varios tamaños)
- Descripción de la app
- Privacy Policy URL
- Categoría: Productividad o Estilo de vida

#### Google Play (Android):

```bash
# Submit automático
eas submit --platform android

# O manual:
# 1. Descarga el .aab
# 2. Sube en Google Play Console
# 3. Configura metadata
```

**Requisitos Play Store:**
- Screenshots (mínimo 2)
- Descripción corta y larga
- Privacy Policy URL
- Clasificación de contenido

---

## 🔧 Configuración Avanzada

### Updates Over-The-Air (OTA)

Para actualizar la app sin pasar por las tiendas:

```bash
# Publicar update
eas update --branch production --message "Fix de bug crítico"

# Ver updates
eas update:list

# Rollback
eas update:rollback
```

**Limitaciones**: Solo cambios en JavaScript/assets, NO cambios nativos.

---

### CI/CD con GitHub Actions

Ya tienes el proyecto en GitHub. Para automatizar builds:

1. Crea un token de Expo:
```bash
eas build:configure
```

2. Agrégalo como secret en GitHub:
- Ve a: https://github.com/JesusDelaVega/invitationweb-mobile/settings/secrets
- Crea: `EXPO_TOKEN` con el valor del token

3. Crea `.github/workflows/build.yml` (ver DEPLOYMENT.md)

---

## 📊 Checklist Pre-Launch

### Configuración
- [ ] Autenticado en Expo (`eas whoami`)
- [ ] Project ID configurado en app.json
- [ ] Google Maps API Key configurado (opcional)
- [ ] Assets (iconos) creados
- [ ] Build de desarrollo probado
- [ ] Credenciales de producción configuradas

### Testing
- [ ] Login funciona
- [ ] Crear proyecto funciona
- [ ] Upload de imágenes funciona
- [ ] Preview funciona
- [ ] Publicar funciona
- [ ] Share funciona
- [ ] IAP configurado (opcional para v1)

### Tiendas
- [ ] Apple Developer Account activo ($99/año)
- [ ] Google Play Console activo ($25)
- [ ] Screenshots preparados
- [ ] Descripciones escritas
- [ ] Privacy Policy URL lista
- [ ] Terms of Service URL lista

---

## 🆘 Troubleshooting

### "Not logged in"
```bash
eas login
```

### "Project not found"
```bash
eas init
```

### Build falla
```bash
# Limpiar caché
eas build --profile development --platform android --clear-cache

# O local:
npm run clean
npm install
```

### Submit falla
```bash
# Verificar credenciales
eas credentials

# Submit manual con path específico
eas submit --platform ios --path ./build.ipa
```

---

## 🔗 Links Útiles

- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction
- **EAS Submit**: https://docs.expo.dev/submit/introduction
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console
- **Repositorio GitHub**: https://github.com/JesusDelaVega/invitationweb-mobile

---

## 📞 Soporte

Si tienes problemas:
1. Revisa DEPLOYMENT.md para más detalles
2. Consulta Expo docs
3. Abre un issue en GitHub

---

## 🎉 Siguiente Paso

**AHORA EJECUTA**:

```bash
cd /home/jesusdelavega/logowebmx-mobile
eas login
```

Después de autenticarte, ejecuta:

```bash
eas init
```

¡Y estarás listo para crear tu primer build!
