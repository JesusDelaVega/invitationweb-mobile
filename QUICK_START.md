# ⚡ Inicio Rápido - InvitationWeb Mobile

**¿Quieres probar la app AHORA?** Sigue estos 3 pasos simples.

---

## 📱 Opción 1: Probar en 5 minutos (Expo Go)

La forma más rápida para ver la app funcionando (con limitaciones).

### Paso 1: Instalar Expo Go

- **Android**: [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### Paso 2: Iniciar servidor

```bash
cd /home/jesusdelavega/logowebmx-mobile
npm start
```

### Paso 3: Escanear QR

- **Android**: Abre Expo Go → Scan QR code
- **iOS**: Abre Cámara → Escanea QR → Abre en Expo Go

**¡Listo!** La app se abrirá en tu teléfono.

**⚠️ Limitación**: No podrás probar IAP, notificaciones push, ni algunos features nativos.

---

## 🔧 Opción 2: Development Build Completo (Recomendado)

Para probar TODAS las features incluyendo IAP, notificaciones, etc.

### Paso 1: Autenticarse en Expo

```bash
cd /home/jesusdelavega/logowebmx-mobile

# Si no tienes cuenta: https://expo.dev/signup
eas login
```

### Paso 2: Inicializar proyecto

```bash
eas init
```

### Paso 3: Crear build de desarrollo

**Para Android** (más rápido, 10-20 min):
```bash
eas build --profile development --platform android
```

Espera a que termine. Recibirás un link para descargar el APK.

**Para iOS** (requiere Apple Developer, 15-30 min):
```bash
eas build --profile development --platform ios
```

### Paso 4: Instalar en tu dispositivo

**Android:**
1. Descarga APK desde el link
2. Transfiere a tu teléfono
3. Instala (permite "fuentes desconocidas")

**iOS:**
1. Descarga desde el link en tu iPhone
2. Sigue instrucciones de Expo

### Paso 5: Ejecutar

```bash
npm start

# La app en tu dispositivo se conectará automáticamente
```

---

## 🚀 Opción 3: Publicar en Tiendas (Producción)

Para publicar en App Store y Google Play Store.

### Paso 1: Validar proyecto

```bash
bash scripts/validate.sh
```

Corrige cualquier error encontrado.

### Paso 2: Configurar credenciales

```bash
# Esto te guiará para configurar certificados y keystores
eas credentials
```

**Necesitas:**
- Apple Developer Account ($99/año) - para iOS
- Google Play Console ($25 única vez) - para Android

### Paso 3: Build de producción

```bash
# Ambas plataformas (30-60 min total)
eas build --profile production --platform all

# O por separado:
eas build --profile production --platform ios      # 15-30 min
eas build --profile production --platform android  # 15-30 min
```

### Paso 4: Submit a las tiendas

```bash
# App Store
eas submit --platform ios

# Google Play
eas submit --platform android
```

### Paso 5: Configurar metadata en las consolas

**App Store Connect**: https://appstoreconnect.apple.com
- Screenshots
- Descripción
- Keywords
- Privacy Policy URL

**Google Play Console**: https://play.google.com/console
- Screenshots
- Descripción corta y larga
- Categoría
- Privacy Policy URL

---

## 🎯 ¿Cuál opción elegir?

| Opción | Tiempo | Complejidad | Features | Cuándo usar |
|--------|--------|-------------|----------|-------------|
| **Expo Go** | 5 min | ⭐ Muy fácil | 70% | Testing rápido durante desarrollo |
| **Dev Build** | 20 min | ⭐⭐ Fácil | 100% | Testing completo de todas las features |
| **Producción** | 2-3 horas | ⭐⭐⭐ Medio | 100% | Publicar en tiendas oficiales |

---

## 📋 Checklist Rápido

### Para Expo Go (5 min)
- [ ] Instalar Expo Go app
- [ ] `npm start`
- [ ] Escanear QR

### Para Development Build (20 min)
- [ ] `eas login`
- [ ] `eas init`
- [ ] `eas build --profile development --platform android`
- [ ] Instalar APK
- [ ] `npm start`

### Para Producción (2-3 horas)
- [ ] Apple Developer + Google Play cuentas
- [ ] `bash scripts/validate.sh`
- [ ] `eas credentials`
- [ ] `eas build --profile production --platform all`
- [ ] Preparar screenshots y metadata
- [ ] `eas submit --platform ios`
- [ ] `eas submit --platform android`

---

## 🆘 Troubleshooting Rápido

### "Metro bundler error"
```bash
npm start -- --reset-cache
```

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### "EAS build failed"
```bash
# Ver logs detallados
eas build --profile development --platform android --clear-cache
```

### "App no instala en Android"
```bash
# Habilita "Instalar desde fuentes desconocidas"
# Settings → Security → Unknown sources
```

---

## 📚 Documentación Completa

Para guías detalladas, lee:

- **SETUP.md** - Configuración paso a paso completa
- **CONFIG.md** - Variables y secretos necesarios
- **TESTING.md** - Casos de prueba y testing
- **DEPLOYMENT.md** - Deployment avanzado y CI/CD
- **PROJECT_SUMMARY.md** - Resumen técnico completo

---

## 🎉 Comandos Más Usados

```bash
# Desarrollo local
npm start                    # Iniciar Metro bundler
npm run ios                  # iOS Simulator
npm run android              # Android Emulator
npm run lint                 # Verificar TypeScript

# Validation
bash scripts/validate.sh     # Validar proyecto
bash scripts/setup.sh        # Setup automatizado

# EAS Builds
eas login                    # Autenticarse
eas init                     # Inicializar proyecto
eas build --profile development --platform android
eas build --profile production --platform all

# Submit
eas submit --platform ios
eas submit --platform android

# Updates OTA
eas update --branch production --message "Fix bug"
```

---

## 🔗 Links Útiles

- **Repositorio**: https://github.com/JesusDelaVega/invitationweb-mobile
- **Expo Account**: https://expo.dev
- **App Store Connect**: https://appstoreconnect.apple.com
- **Google Play Console**: https://play.google.com/console

---

## 💡 Tips Pro

1. **Usa Expo Go** para iteración rápida durante desarrollo
2. **Usa Development Build** para testing completo antes de producción
3. **Haz builds de producción** solo cuando esté todo probado
4. **Lee TESTING.md** para casos de prueba completos
5. **Usa OTA updates** para hotfixes sin resubmit a tiendas

---

## 🚀 ¡Empecemos!

Ejecuta este comando AHORA:

```bash
cd /home/jesusdelavega/logowebmx-mobile && npm start
```

¡Y escanea el QR con Expo Go para ver tu app funcionando! 📱✨
