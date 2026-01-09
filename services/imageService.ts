// Image Service - Camera, Gallery, Upload
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert, Platform } from 'react-native';
import { ApiService } from './api';

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class ImageService {
  /**
   * Request camera permissions
   */
  async requestCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permiso Requerido',
        'Necesitamos acceso a tu cámara para tomar fotos.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  }

  /**
   * Request media library permissions
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permiso Requerido',
        'Necesitamos acceso a tu galería para seleccionar fotos.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  }

  /**
   * Take photo from camera
   */
  async takePhoto(options?: {
    aspect?: [number, number];
    quality?: number;
    allowsEditing?: boolean;
  }): Promise<ImagePickerResult | null> {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options?.allowsEditing ?? true,
        aspect: options?.aspect ?? [16, 9],
        quality: options?.quality ?? 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type || 'image',
        };
      }

      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
      return null;
    }
  }

  /**
   * Pick image from gallery
   */
  async pickFromGallery(options?: {
    aspect?: [number, number];
    quality?: number;
    allowsEditing?: boolean;
    allowsMultipleSelection?: boolean;
  }): Promise<ImagePickerResult[]> {
    const hasPermission = await this.requestMediaLibraryPermission();
    if (!hasPermission) return [];

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options?.allowsEditing ?? true,
        allowsMultipleSelection: options?.allowsMultipleSelection ?? false,
        aspect: options?.aspect ?? [16, 9],
        quality: options?.quality ?? 0.8,
      });

      if (!result.canceled && result.assets) {
        return result.assets.map(asset => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type || 'image',
        }));
      }

      return [];
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      return [];
    }
  }

  /**
   * Optimize image (resize and compress)
   */
  async optimizeImage(
    uri: string,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      compress?: number;
      format?: ImageManipulator.SaveFormat;
    }
  ): Promise<string> {
    try {
      const maxWidth = options?.maxWidth ?? 1920;
      const maxHeight = options?.maxHeight ?? 1920;
      const compress = options?.compress ?? 0.8;
      const format = options?.format ?? ImageManipulator.SaveFormat.WEBP;

      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: maxWidth,
              height: maxHeight,
            },
          },
        ],
        {
          compress,
          format,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Error optimizing image:', error);
      return uri; // Return original if optimization fails
    }
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadImage(
    uri: string,
    folder: string = 'invitations',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      // Create form data
      const formData = new FormData();

      // Extract filename from URI
      const filename = uri.split('/').pop() || `upload_${Date.now()}.webp`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/webp';

      // Append file to form data
      formData.append('file', {
        uri,
        type,
        name: filename,
      } as any);

      formData.append('folder', folder);

      // Upload to server
      const response = await ApiService.images.upload(
        formData,
        (percentage) => {
          if (onProgress) {
            onProgress({
              loaded: percentage,
              total: 100,
              percentage,
            });
          }
        }
      );

      return response.data.url;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.response?.data?.error || 'Error al subir imagen');
    }
  }

  /**
   * Show image picker options (Camera or Gallery)
   */
  showImagePickerOptions(onSelect: (images: ImagePickerResult[]) => void) {
    Alert.alert(
      'Seleccionar Imagen',
      'Elige una opción',
      [
        {
          text: 'Cámara',
          onPress: async () => {
            const result = await this.takePhoto();
            if (result) {
              onSelect([result]);
            }
          },
        },
        {
          text: 'Galería',
          onPress: async () => {
            const results = await this.pickFromGallery();
            if (results.length > 0) {
              onSelect(results);
            }
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }

  /**
   * Complete flow: Pick, Optimize, Upload
   */
  async pickOptimizeAndUpload(
    folder: string = 'invitations',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string | null> {
    return new Promise((resolve) => {
      this.showImagePickerOptions(async (images) => {
        if (images.length === 0) {
          resolve(null);
          return;
        }

        try {
          const image = images[0];

          // Optimize image
          const optimizedUri = await this.optimizeImage(image.uri);

          // Upload to Cloudinary
          const url = await this.uploadImage(optimizedUri, folder, onProgress);

          resolve(url);
        } catch (error) {
          console.error('Error in pick-optimize-upload flow:', error);
          Alert.alert('Error', 'No se pudo procesar la imagen');
          resolve(null);
        }
      });
    });
  }

  /**
   * Pick multiple images for gallery
   */
  async pickMultipleImages(
    maxImages: number = 10
  ): Promise<ImagePickerResult[]> {
    const hasPermission = await this.requestMediaLibraryPermission();
    if (!hasPermission) return [];

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages,
      });

      if (!result.canceled && result.assets) {
        return result.assets.map(asset => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: asset.type || 'image',
        }));
      }

      return [];
    } catch (error) {
      console.error('Error picking multiple images:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
      return [];
    }
  }
}

export const imageService = new ImageService();
export default imageService;
