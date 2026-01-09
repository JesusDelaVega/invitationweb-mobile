// Location Editor - Manage event location
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Linking,
} from 'react-native';
import { useEditor } from '../../store/editorStore';

export default function LocationEditor() {
  const { websiteData, updateSection } = useEditor();

  const locationData = websiteData.location || {
    title: { es: 'Ubicación' },
    venue: { es: '' },
    address: '',
    lat: 0,
    lng: 0,
  };

  // Get current values (handle MultiLanguageString)
  const title = typeof locationData.title === 'string'
    ? locationData.title
    : locationData.title?.es || 'Ubicación';
  const venue = typeof locationData.venue === 'string'
    ? locationData.venue
    : locationData.venue?.es || '';

  const handleTitleChange = (value: string) => {
    updateSection('location', {
      title: { es: value },
    });
  };

  const handleVenueChange = (value: string) => {
    updateSection('location', {
      venue: { es: value },
    });
  };

  const handleAddressChange = (value: string) => {
    updateSection('location', {
      address: value,
    });
  };

  const handleLatChange = (value: string) => {
    const lat = parseFloat(value);
    if (!isNaN(lat)) {
      updateSection('location', {
        lat,
      });
    }
  };

  const handleLngChange = (value: string) => {
    const lng = parseFloat(value);
    if (!isNaN(lng)) {
      updateSection('location', {
        lng,
      });
    }
  };

  const handleOpenMaps = () => {
    if (locationData.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        locationData.address
      )}`;
      Linking.openURL(url);
    }
  };

  const handleUseCurrentLocation = () => {
    // TODO: Implement geolocation with expo-location
    // For now, show placeholder
    alert('Geolocalización estará disponible próximamente');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ubicación del Evento</Text>
      <Text style={styles.sectionDescription}>
        Información sobre dónde se llevará a cabo el evento
      </Text>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="Ej: Ubicación"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Venue */}
      <View style={styles.field}>
        <Text style={styles.label}>Nombre del lugar *</Text>
        <TextInput
          style={styles.input}
          value={venue}
          onChangeText={handleVenueChange}
          placeholder="Ej: Jardín Los Rosales"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Address */}
      <View style={styles.field}>
        <Text style={styles.label}>Dirección *</Text>
        <Text style={styles.hint}>
          Dirección completa del evento
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={locationData.address || ''}
          onChangeText={handleAddressChange}
          placeholder="Ej: Av. Principal 123, Col. Centro, Ciudad de México"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Map Actions */}
      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={handleOpenMaps}
          disabled={!locationData.address}
        >
          <Text style={styles.actionButtonTextPrimary}>
            📍 Buscar en Maps
          </Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.actionButtonText}>
            🎯 Usar mi ubicación
          </Text>
        </Pressable>
      </View>

      {/* Coordinates */}
      <View style={styles.coordinatesSection}>
        <Text style={styles.sectionSubtitle}>Coordenadas (Opcional)</Text>
        <Text style={styles.hint}>
          Si conoces las coordenadas exactas, ingrésalas aquí
        </Text>

        <View style={styles.coordinatesRow}>
          <View style={[styles.field, styles.coordinateField]}>
            <Text style={styles.label}>Latitud</Text>
            <TextInput
              style={styles.input}
              value={locationData.lat?.toString() || ''}
              onChangeText={handleLatChange}
              placeholder="19.4326"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.field, styles.coordinateField]}>
            <Text style={styles.label}>Longitud</Text>
            <TextInput
              style={styles.input}
              value={locationData.lng?.toString() || ''}
              onChangeText={handleLngChange}
              placeholder="-99.1332"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {locationData.lat !== 0 && locationData.lng !== 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ✓ El mapa mostrará la ubicación exacta en tu invitación
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#4285f4',
    borderColor: '#4285f4',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  actionButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  coordinatesSection: {
    marginTop: 8,
  },
  coordinatesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  coordinateField: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#065f46',
  },
});
