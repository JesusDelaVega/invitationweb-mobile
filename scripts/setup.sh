#!/bin/bash
# Script de configuración para InvitationWeb Mobile
# Ejecuta: bash scripts/setup.sh

set -e

echo "🚀 Configuración de InvitationWeb Mobile"
echo "========================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "app.json" ]; then
    echo -e "${RED}❌ Error: Ejecuta este script desde el directorio del proyecto${NC}"
    echo "   cd /home/jesusdelavega/logowebmx-mobile"
    echo "   bash scripts/setup.sh"
    exit 1
fi

echo -e "${YELLOW}Paso 1: Verificando instalación de EAS CLI...${NC}"
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI no está instalado${NC}"
    echo "   Instalando..."
    npm install -g eas-cli
    echo -e "${GREEN}✅ EAS CLI instalado${NC}"
else
    echo -e "${GREEN}✅ EAS CLI ya está instalado ($(eas --version))${NC}"
fi
echo ""

echo -e "${YELLOW}Paso 2: Verificando autenticación en Expo...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${RED}❌ No estás autenticado en Expo${NC}"
    echo ""
    echo "Por favor autentícate ejecutando:"
    echo -e "${GREEN}  eas login${NC}"
    echo ""
    echo "Si no tienes cuenta, créala en: https://expo.dev/signup"
    echo ""
    echo "Después de autenticarte, vuelve a ejecutar este script."
    exit 1
else
    EXPO_USER=$(eas whoami)
    echo -e "${GREEN}✅ Autenticado como: ${EXPO_USER}${NC}"
fi
echo ""

echo -e "${YELLOW}Paso 3: Inicializando proyecto en Expo...${NC}"
if grep -q "PLACEHOLDER_WILL_BE_UPDATED_BY_EAS_INIT" app.json; then
    echo "   Ejecutando eas init..."
    eas init
    echo -e "${GREEN}✅ Proyecto inicializado${NC}"
else
    echo -e "${GREEN}✅ Proyecto ya está inicializado${NC}"
fi
echo ""

echo -e "${YELLOW}Paso 4: Verificando assets...${NC}"
if [ -f "assets/images/icon.png" ]; then
    echo -e "${GREEN}✅ Assets encontrados${NC}"
else
    echo -e "${YELLOW}⚠️  Assets por defecto no encontrados${NC}"
    echo "   Asegúrate de tener los iconos en assets/images/"
fi
echo ""

echo -e "${YELLOW}Paso 5: Verificando dependencias...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo "   Instalando dependencias..."
    npm install
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
fi
echo ""

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Configuración básica completada${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. (Opcional) Configura Google Maps API Key:"
echo "   - Ve a: https://console.cloud.google.com/apis/credentials"
echo "   - Crea una API Key"
echo "   - Edita app.json y reemplaza YOUR_GOOGLE_MAPS_API_KEY"
echo ""
echo "2. Crea un build de desarrollo para probar:"
echo -e "   ${GREEN}eas build --profile development --platform android${NC}"
echo ""
echo "3. Cuando esté todo probado, crea build de producción:"
echo -e "   ${GREEN}eas build --profile production --platform all${NC}"
echo ""
echo "4. Submit a las tiendas:"
echo -e "   ${GREEN}eas submit --platform ios${NC}"
echo -e "   ${GREEN}eas submit --platform android${NC}"
echo ""
echo "📖 Para más información, lee SETUP.md"
echo ""
