// Preview Screen - Preview invitation in WebView
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useProjects } from '../../store/projectStore';
import { useUser } from '../../store/authStore';
import { canPublish } from '@/shared';
import { shareService } from '../../services/shareService';

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProject, currentProject, updateProject } = useProjects();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (id !== 'new') {
        try {
          await getProject(id);
        } catch (error) {
          Alert.alert('Error', 'No se pudo cargar el proyecto');
          router.back();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handlePublish = async () => {
    if (!currentProject || !user) return;

    // Check if user can publish
    const canUserPublish = canPublish(user.current_plan);
    if (!canUserPublish.allowed) {
      // Show upgrade modal
      Alert.alert(
        'Actualiza tu plan',
        canUserPublish.reason,
        [
          {
            text: 'Ver planes',
            onPress: () => router.push('/plans'),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // Validate website data
    const parsedData = typeof currentProject.website_data === 'string'
      ? JSON.parse(currentProject.website_data)
      : currentProject.website_data;
    const heroTitle = typeof parsedData.hero?.title === 'string'
      ? parsedData.hero.title
      : parsedData.hero?.title?.es || '';

    if (!heroTitle) {
      Alert.alert('Campos requeridos', 'Debes agregar un título a tu invitación');
      return;
    }

    // Confirm publish
    Alert.alert(
      'Publicar invitación',
      '¿Estás seguro de que quieres publicar esta invitación? Se generará un link público.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Publicar',
          onPress: async () => {
            setIsPublishing(true);
            try {
              await updateProject(id, {
                is_published: true,
              });

              Alert.alert(
                '¡Publicado!',
                'Tu invitación ha sido publicada exitosamente',
                [
                  {
                    text: 'Compartir',
                    onPress: handleShare,
                  },
                  {
                    text: 'Ver',
                    onPress: () => {
                      // Reload preview
                      getProject(id);
                    },
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.response?.data?.error || 'No se pudo publicar la invitación'
              );
            } finally {
              setIsPublishing(false);
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    if (!currentProject) return;
    shareService.showShareOptions(currentProject);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285f4" />
          <Text style={styles.loadingText}>Cargando vista previa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const previewUrl = currentProject?.is_published && currentProject?.published_url
    ? currentProject.published_url
    : `https://invitationweb.app/#website/${id}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>✕</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Vista Previa</Text>

        <View style={styles.headerActions}>
          {currentProject?.is_published ? (
            <Pressable onPress={handleShare} style={styles.shareButton}>
              <Text style={styles.shareButtonText}>↗</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handlePublish}
              style={[styles.publishButton, isPublishing && styles.publishButtonDisabled]}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.publishButtonText}>Publicar</Text>
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: previewUrl }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator size="large" color="#4285f4" />
          </View>
        )}
      />

      {/* Bottom info */}
      {currentProject?.is_published && (
        <View style={styles.publishedBanner}>
          <Text style={styles.publishedText}>
            ✓ Publicado - {currentProject.published_url}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#111827',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    width: 100,
    alignItems: 'flex-end',
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 24,
    color: '#111827',
  },
  publishButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  publishButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  publishedBanner: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  publishedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
