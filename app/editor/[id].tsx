// Editor Screen - Edit invitation sections
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEditor } from '../../store/editorStore';
import { useProjects } from '../../store/projectStore';
import HeroEditor from '../../components/editor/HeroEditor';
import GalleryEditor from '../../components/editor/GalleryEditor';
import RSVPEditor from '../../components/editor/RSVPEditor';
import LocationEditor from '../../components/editor/LocationEditor';

type EditorSection = 'hero' | 'gallery' | 'rsvp' | 'location';

const SECTIONS: { id: EditorSection; label: string; icon: string }[] = [
  { id: 'hero', label: 'Portada', icon: '🎨' },
  { id: 'gallery', label: 'Galería', icon: '📸' },
  { id: 'rsvp', label: 'RSVP', icon: '✉️' },
  { id: 'location', label: 'Ubicación', icon: '📍' },
];

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateProject } = useProjects();
  const {
    websiteData,
    currentSection,
    isDirty,
    isSaving,
    setWebsiteData,
    setCurrentSection,
    markClean,
    setSaving,
    setProjectId,
  } = useEditor();

  const [isLoading, setIsLoading] = useState(true);
  const { getProject, currentProject } = useProjects();

  // Load project data
  useEffect(() => {
    const loadProject = async () => {
      if (id === 'new') {
        // New project - use default data
        setProjectId('new');
        setIsLoading(false);
      } else {
        // Existing project - load from API
        try {
          await getProject(id);
        } catch (error) {
          Alert.alert('Error', 'No se pudo cargar el proyecto');
          router.back();
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProject();
  }, [id]);

  // Update editor when project loads
  useEffect(() => {
    if (currentProject && currentProject.website_data) {
      // Parse website_data if it's a string
      const parsedData = typeof currentProject.website_data === 'string'
        ? JSON.parse(currentProject.website_data)
        : currentProject.website_data;
      setWebsiteData(parsedData);
      setProjectId(currentProject.id);
    }
  }, [currentProject]);

  // Auto-save when dirty
  useEffect(() => {
    if (!isDirty || id === 'new') return;

    const timeoutId = setTimeout(async () => {
      await handleSave();
    }, 2000); // Save 2 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [isDirty, websiteData]);

  const handleSave = async () => {
    if (!isDirty || id === 'new') return;

    setSaving(true);
    try {
      await updateProject(id, {
        website_data: websiteData,
      });
      markClean();
    } catch (error) {
      console.error('Error saving project:', error);
      // Don't show alert for auto-save failures
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      Alert.alert(
        'Cambios sin guardar',
        '¿Quieres guardar los cambios antes de salir?',
        [
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => router.back(),
          },
          {
            text: 'Guardar',
            onPress: async () => {
              await handleSave();
              router.back();
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const renderSectionEditor = () => {
    switch (currentSection) {
      case 'hero':
        return <HeroEditor />;
      case 'gallery':
        return <GalleryEditor />;
      case 'rsvp':
        return <RSVPEditor />;
      case 'location':
        return <LocationEditor />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285f4" />
          <Text style={styles.loadingText}>Cargando proyecto...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Editor</Text>
          {isSaving && (
            <Text style={styles.savingText}>Guardando...</Text>
          )}
          {!isSaving && isDirty && (
            <Text style={styles.unsavedText}>Sin guardar</Text>
          )}
          {!isSaving && !isDirty && id !== 'new' && (
            <Text style={styles.savedText}>✓ Guardado</Text>
          )}
        </View>

        <Pressable
          onPress={() => router.push(`/preview/${id}`)}
          style={styles.previewButton}
        >
          <Text style={styles.previewButtonText}>👁️</Text>
        </Pressable>
      </View>

      {/* Section Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sectionTabs}
        contentContainerStyle={styles.sectionTabsContent}
      >
        {SECTIONS.map((section) => (
          <Pressable
            key={section.id}
            style={[
              styles.sectionTab,
              currentSection === section.id && styles.sectionTabActive,
            ]}
            onPress={() => setCurrentSection(section.id)}
          >
            <Text style={styles.sectionIcon}>{section.icon}</Text>
            <Text
              style={[
                styles.sectionLabel,
                currentSection === section.id && styles.sectionLabelActive,
              ]}
            >
              {section.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Section Editor */}
      <ScrollView
        style={styles.editorContainer}
        contentContainerStyle={styles.editorContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSectionEditor()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    fontSize: 28,
    color: '#111827',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  savingText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  unsavedText: {
    fontSize: 12,
    color: '#f59e0b',
    marginTop: 2,
  },
  savedText: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
  },
  previewButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 24,
  },
  sectionTabs: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  sectionTabActive: {
    backgroundColor: '#4285f4',
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  sectionLabelActive: {
    color: '#fff',
  },
  editorContainer: {
    flex: 1,
  },
  editorContent: {
    padding: 20,
  },
});
