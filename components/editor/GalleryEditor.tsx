// Gallery Editor - Manage photo gallery
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEditor } from '../../store/editorStore';
import { imageService, UploadProgress } from '../../services/imageService';
import { GalleryImage } from '@/shared';

export default function GalleryEditor() {
  const { websiteData, updateSection } = useEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const galleryData = websiteData.gallery || {
    title: { es: 'Galería' },
    images: [],
    maxImages: 30,
  };
  const images: GalleryImage[] = galleryData.images || [];
  const maxImages = galleryData.maxImages || 30;

  const handleAddImages = async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        'Límite alcanzado',
        `Solo puedes agregar hasta ${maxImages} imágenes a la galería.`
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Pick multiple images
      const pickedImages = await imageService.pickMultipleImages(
        maxImages - images.length
      );

      if (pickedImages.length === 0) {
        setIsUploading(false);
        return;
      }

      // Upload each image
      const uploadedUrls: string[] = [];
      for (let i = 0; i < pickedImages.length; i++) {
        const pickedImage = pickedImages[i];

        // Update progress
        setUploadProgress(Math.round(((i + 1) / pickedImages.length) * 100));

        // Optimize image
        const optimizedUri = await imageService.optimizeImage(pickedImage.uri);

        // Upload to Cloudinary
        const url = await imageService.uploadImage(optimizedUri, 'gallery');
        uploadedUrls.push(url);
      }

      // Add to gallery
      const newImages = uploadedUrls.map((url) => ({ url }));
      updateSection('gallery', {
        images: [...images, ...newImages],
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Error', 'No se pudieron subir las imágenes');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index: number) => {
    Alert.alert(
      'Eliminar imagen',
      '¿Estás seguro de que quieres eliminar esta imagen?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const newImages = images.filter((_, i) => i !== index);
            updateSection('gallery', {
              images: newImages,
            });
          },
        },
      ]
    );
  };

  const renderImageItem = ({ item, index }: { item: GalleryImage; index: number }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.url }} style={styles.imageItemImage} resizeMode="cover" />
      <Pressable
        style={styles.removeButton}
        onPress={() => handleRemoveImage(index)}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Galería de Fotos</Text>
      <Text style={styles.sectionDescription}>
        Agrega hasta {maxImages} fotos a tu invitación
      </Text>

      {/* Images count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {images.length} / {maxImages} imágenes
        </Text>
      </View>

      {/* Add Images Button */}
      <Pressable
        style={[
          styles.addButton,
          (isUploading || images.length >= maxImages) && styles.addButtonDisabled,
        ]}
        onPress={handleAddImages}
        disabled={isUploading || images.length >= maxImages}
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
            <Text style={styles.addButtonIcon}>📸</Text>
            <Text style={styles.addButtonText}>
              {images.length >= maxImages
                ? 'Límite alcanzado'
                : 'Agregar fotos'}
            </Text>
          </>
        )}
      </Pressable>

      {/* Images Grid */}
      {images.length > 0 ? (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => `${item.url}-${index}`}
          numColumns={3}
          contentContainerStyle={styles.grid}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📷</Text>
          <Text style={styles.emptyText}>
            Aún no has agregado fotos a tu galería
          </Text>
        </View>
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
    marginBottom: 16,
  },
  countContainer: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  addButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  addButtonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  addButtonText: {
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
  grid: {
    marginHorizontal: -4,
  },
  imageItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imageItemImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
