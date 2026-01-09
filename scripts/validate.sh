#!/bin/bash
# Script de validación pre-build
# Ejecuta: bash scripts/validate.sh

set -e

echo "🔍 Validación Pre-Build de InvitationWeb Mobile"
echo "=============================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Función para mostrar resultado
check_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        ERRORS=$((ERRORS + 1))
    fi
}

warn_result() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "📋 Verificando estructura del proyecto..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "app.json" ]; then
    echo -e "${RED}❌ Error: app.json no encontrado${NC}"
    echo "   Ejecuta este script desde el directorio del proyecto"
    exit 1
fi
check_result "Directorio del proyecto correcto"

# Verificar Node.js
NODE_VERSION=$(node --version)
check_result "Node.js instalado ($NODE_VERSION)"

# Verificar npm
NPM_VERSION=$(npm --version)
check_result "npm instalado ($NPM_VERSION)"

# Verificar EAS CLI
if command -v eas &> /dev/null; then
    EAS_VERSION=$(eas --version)
    check_result "EAS CLI instalado ($EAS_VERSION)"
else
    echo -e "${RED}❌ EAS CLI no está instalado${NC}"
    echo "   Instala con: npm install -g eas-cli"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "📦 Verificando dependencias..."
echo ""

# Verificar node_modules
if [ -d "node_modules" ]; then
    check_result "node_modules existe"
else
    echo -e "${RED}❌ node_modules no existe${NC}"
    echo "   Ejecuta: npm install"
    ERRORS=$((ERRORS + 1))
fi

# Verificar paquetes críticos
CRITICAL_PACKAGES=("expo" "react" "react-native" "expo-router")
for package in "${CRITICAL_PACKAGES[@]}"; do
    if [ -d "node_modules/$package" ]; then
        check_result "Paquete $package instalado"
    else
        echo -e "${RED}❌ Paquete $package no encontrado${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "🖼️  Verificando assets..."
echo ""

# Verificar assets requeridos
REQUIRED_ASSETS=(
    "assets/images/icon.png"
    "assets/images/adaptive-icon.png"
    "assets/images/splash-icon.png"
    "assets/images/favicon.png"
)

for asset in "${REQUIRED_ASSETS[@]}"; do
    if [ -f "$asset" ]; then
        # Verificar que sea PNG válido
        if file "$asset" | grep -q "PNG image data"; then
            check_result "Asset válido: $(basename $asset)"
        else
            warn_result "Asset existe pero puede no ser PNG válido: $(basename $asset)"
        fi
    else
        warn_result "Asset no encontrado: $(basename $asset)"
    fi
done

echo ""
echo "⚙️  Verificando configuración..."
echo ""

# Verificar app.json
if grep -q "PLACEHOLDER_WILL_BE_UPDATED_BY_EAS_INIT" app.json; then
    warn_result "Project ID aún no configurado (ejecuta: eas init)"
else
    check_result "Project ID configurado en app.json"
fi

# Verificar Google Maps API Key
if grep -q "YOUR_GOOGLE_MAPS_API_KEY" app.json; then
    warn_result "Google Maps API Key no configurado (opcional)"
    info "   Para configurarlo, ve a: https://console.cloud.google.com"
else
    check_result "Google Maps API Key configurado"
fi

# Verificar eas.json
if [ -f "eas.json" ]; then
    check_result "eas.json existe"
else
    echo -e "${RED}❌ eas.json no encontrado${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🔨 Verificando TypeScript..."
echo ""

# Verificar compilación de TypeScript
if npx tsc --noEmit > /dev/null 2>&1; then
    check_result "TypeScript compila sin errores"
else
    echo -e "${RED}❌ Errores de TypeScript encontrados${NC}"
    echo "   Ejecuta: npm run lint"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "🔐 Verificando autenticación Expo..."
echo ""

# Verificar autenticación Expo
if eas whoami > /dev/null 2>&1; then
    EXPO_USER=$(eas whoami)
    check_result "Autenticado en Expo como: $EXPO_USER"
else
    warn_result "No autenticado en Expo (ejecuta: eas login)"
fi

echo ""
echo "=============================================="
echo ""

# Resumen
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Todo perfecto! El proyecto está listo para build${NC}"
    echo ""
    echo "Próximo paso:"
    echo -e "${BLUE}  eas build --profile development --platform android${NC}"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Validación completada con $WARNINGS advertencias${NC}"
    echo ""
    echo "El proyecto puede hacer build, pero considera resolver las advertencias."
    echo ""
    echo "Próximo paso:"
    echo -e "${BLUE}  eas build --profile development --platform android${NC}"
else
    echo -e "${RED}❌ Validación falló con $ERRORS errores y $WARNINGS advertencias${NC}"
    echo ""
    echo "Por favor corrige los errores antes de hacer build."
    exit 1
fi

echo ""
echo "📖 Para más información:"
echo "   - Setup: cat SETUP.md"
echo "   - Config: cat CONFIG.md"
echo "   - Deployment: cat DEPLOYMENT.md"
echo ""
