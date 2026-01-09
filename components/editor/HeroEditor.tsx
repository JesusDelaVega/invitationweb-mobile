// Hero Editor - Edit hero section (title, subtitle, date, image)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useEditor } from '../../store/editorStore';
import { imageService, UploadProgress } from '../../services/imageService';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HeroEditor() {
  const { websiteData, updateSection } = useEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const heroData = websiteData.hero || {
    title: { es: '' },
    date: new Date().toISOString(),
    time: '18:00',
  };

  // Get current values (handle MultiLanguageString)
  const title = typeof heroData.title === 'string'
    ? heroData.title
    : heroData.title?.es || '';
  const subtitle = typeof heroData.subtitle === 'string'
    ? heroData.subtitle
    : heroData.subtitle?.es || '';
  const description = typeof heroData.description === 'string'
    ? heroData.description
    : heroData.description?.es || '';

  const handleTitleChange = (value: string) => {
    updateSection('hero', {
      title: { es: value },
    });
  };

  const handleSubtitleChange = (value: string) => {
    updateSection('hero', {
      subtitle: { es: value },
    });
  };

  const handleDescriptionChange = (value: string) => {
    updateSection('hero', {
      description: { es: value },
    });
  };

  const handleImagePick = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const url = await imageService.pickOptimizeAndUpload(
        'hero',
        (progress: UploadProgress) => {
          setUploadProgress(progress.percentage);
        }
      );

      if (url) {
        updateSection('hero', {
          backgroundImage: url,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateSection('hero', {
        date: selectedDate.toISOString(),
      });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      updateSection('hero', {
        time: `${hours}:${minutes}`,
      });
    }
  };

  const currentDate = heroData.date ? new Date(heroData.date) : new Date();
  const [hours, minutes] = (heroData.time || '18:00').split(':');
  const currentTime = new Date();
  currentTime.setHours(parseInt(hours), parseInt(minutes));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Portada</Text>
      <Text style={styles.sectionDescription}>
        Información principal de tu invitación
      </Text>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={handleTitleChange}
          placeholder="Ej: Boda de María & Juan"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Subtitle */}
      <View style={styles.field}>
        <Text style={styles.label}>Subtítulo</Text>
        <TextInput
          style={styles.input}
          value={subtitle}
          onChangeText={handleSubtitleChange}
          placeholder="Ej: Nos casamos!"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={handleDescriptionChange}
          placeholder="Ej: Con gran alegría los invitamos a celebrar con nosotros..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Date */}
      <View style={styles.field}>
        <Text style={styles.label}>Fecha del evento *</Text>
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {currentDate.toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={currentDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Time */}
      <View style={styles.field}>
        <Text style={styles.label}>Hora del evento *</Text>
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateButtonText}>{heroData.time || '18:00'}</Text>
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={currentTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>

      {/* Background Image */}
      <View style={styles.field}>
        <Text style={styles.label}>Imagen de fondo</Text>
        <Text style={styles.hint}>
          Usa una imagen de alta calidad (mínimo 1920x1080)
        </Text>

        {heroData.backgroundImage ? (
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: heroData.backgroundImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <Pressable
              style={styles.changeImageButton}
              onPress={handleImagePick}
              disabled={isUploading}
            >
              <Text style={styles.changeImageButtonText}>
                {isUploading ? 'Subiendo...' : 'Cambiar imagen'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.uploadButton}
            onPress={handleImagePick}
            disabled={isUploading}
          >
            {isUploading ? (
              <View style={styles.uploadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.uploadingText}>
                  Subiendo {uploadProgress}%
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.uploadIcon}>📸</Text>
                <Text style={styles.uploadButtonText}>Subir imagen</Text>
              </>
            )}
          </Pressable>
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
    minHeight: 100,
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
  imagePreview: {
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  changeImageButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  changeImageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});
