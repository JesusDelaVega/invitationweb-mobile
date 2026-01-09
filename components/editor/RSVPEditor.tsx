// RSVP Editor - Manage RSVP settings
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
} from 'react-native';
import { useEditor } from '../../store/editorStore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RSVPEditor() {
  const { websiteData, updateSection } = useEditor();
  const [showDeadlinePicker, setShowDeadlinePicker] = React.useState(false);

  const rsvpData = websiteData.rsvp || {
    title: { es: 'Confirma tu Asistencia' },
    message: { es: 'Esperamos contar con tu presencia' },
    enabled: true,
    whatsappEnabled: true,
    formEnabled: true,
  };

  // Get current values (handle MultiLanguageString)
  const title = typeof rsvpData.title === 'string'
    ? rsvpData.title
    : rsvpData.title?.es || 'Confirma tu Asistencia';
  const message = typeof rsvpData.message === 'string'
    ? rsvpData.message
    : rsvpData.message?.es || 'Esperamos contar con tu presencia';

  const handleTitleChange = (value: string) => {
    updateSection('rsvp', {
      title: { es: value },
    });
  };

  const handleMessageChange = (value: string) => {
    updateSection('rsvp', {
      message: { es: value },
    });
  };

  const handleWhatsAppPhoneChange = (value: string) => {
    updateSection('rsvp', {
      whatsappPhone: value,
    });
  };

  const handleEnabledToggle = (value: boolean) => {
    updateSection('rsvp', {
      enabled: value,
    });
  };

  const handleWhatsAppToggle = (value: boolean) => {
    updateSection('rsvp', {
      whatsappEnabled: value,
    });
  };

  const handleFormToggle = (value: boolean) => {
    updateSection('rsvp', {
      formEnabled: value,
    });
  };

  const handleDeadlineChange = (event: any, selectedDate?: Date) => {
    setShowDeadlinePicker(false);
    if (selectedDate) {
      updateSection('rsvp', {
        deadline: selectedDate.toISOString(),
      });
    }
  };

  const currentDeadline = rsvpData.deadline
    ? new Date(rsvpData.deadline)
    : new Date();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Confirmación de Asistencia</Text>
      <Text style={styles.sectionDescription}>
        Configura cómo tus invitados confirmarán su asistencia
      </Text>

      {/* Enable RSVP */}
      <View style={styles.toggleField}>
        <View style={styles.toggleLabel}>
          <Text style={styles.label}>Habilitar RSVP</Text>
          <Text style={styles.hint}>
            Permite que los invitados confirmen su asistencia
          </Text>
        </View>
        <Switch
          value={rsvpData.enabled}
          onValueChange={handleEnabledToggle}
          trackColor={{ false: '#d1d5db', true: '#4285f4' }}
          thumbColor="#fff"
        />
      </View>

      {rsvpData.enabled && (
        <>
          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={handleTitleChange}
              placeholder="Ej: Confirma tu Asistencia"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Message */}
          <View style={styles.field}>
            <Text style={styles.label}>Mensaje</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={handleMessageChange}
              placeholder="Ej: Esperamos contar con tu presencia"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Deadline */}
          <View style={styles.field}>
            <Text style={styles.label}>Fecha límite de confirmación</Text>
            <Text style={styles.hint}>
              Fecha límite para que los invitados confirmen
            </Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => setShowDeadlinePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {rsvpData.deadline
                  ? new Date(rsvpData.deadline).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Sin fecha límite'}
              </Text>
            </Pressable>
            {showDeadlinePicker && (
              <DateTimePicker
                value={currentDeadline}
                mode="date"
                display="default"
                onChange={handleDeadlineChange}
              />
            )}
          </View>

          {/* WhatsApp Toggle */}
          <View style={styles.toggleField}>
            <View style={styles.toggleLabel}>
              <Text style={styles.label}>RSVP por WhatsApp</Text>
              <Text style={styles.hint}>
                Los invitados confirman enviando mensaje a WhatsApp
              </Text>
            </View>
            <Switch
              value={rsvpData.whatsappEnabled}
              onValueChange={handleWhatsAppToggle}
              trackColor={{ false: '#d1d5db', true: '#4285f4' }}
              thumbColor="#fff"
            />
          </View>

          {/* WhatsApp Phone */}
          {rsvpData.whatsappEnabled && (
            <View style={styles.field}>
              <Text style={styles.label}>Número de WhatsApp *</Text>
              <Text style={styles.hint}>
                Formato: código país + número (ej: 521234567890)
              </Text>
              <TextInput
                style={styles.input}
                value={rsvpData.whatsappPhone || ''}
                onChangeText={handleWhatsAppPhoneChange}
                placeholder="521234567890"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
          )}

          {/* Form Toggle */}
          <View style={styles.toggleField}>
            <View style={styles.toggleLabel}>
              <Text style={styles.label}>RSVP por formulario</Text>
              <Text style={styles.hint}>
                Los invitados confirman llenando un formulario
              </Text>
            </View>
            <Switch
              value={rsvpData.formEnabled}
              onValueChange={handleFormToggle}
              trackColor={{ false: '#d1d5db', true: '#4285f4' }}
              thumbColor="#fff"
            />
          </View>

          {/* Info Note */}
          {!rsvpData.whatsappEnabled && !rsvpData.formEnabled && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Debes habilitar al menos un método de confirmación (WhatsApp o
                Formulario)
              </Text>
            </View>
          )}
        </>
      )}
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
  field: {
    marginBottom: 20,
  },
  toggleField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  toggleLabel: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
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
  dateButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fbbf24',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
  },
});
