// Dashboard Screen - List of user projects
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProjects } from '../../store/projectStore';
import { useUser } from '../../store/authStore';
import ProjectCard from '../../components/projects/ProjectCard';
import { canCreateDraft, getPlanLimits } from '@/shared';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useUser();
  const {
    projects,
    isLoading,
    isRefreshing,
    error,
    loadProjects,
    refreshProjects,
  } = useProjects();

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const handleRefresh = () => {
    refreshProjects();
  };

  const handleCreateProject = () => {
    // Check if user can create more projects
    if (user) {
      const planLimits = getPlanLimits(user.current_plan);
      const draftCount = projects.filter(p => !p.is_published).length;

      if (!canCreateDraft(user.current_plan, draftCount)) {
        // Show upgrade modal
        alert(`Has alcanzado el límite de ${planLimits.max_drafts} borradores para tu plan ${planLimits.name}. Actualiza tu plan para crear más proyectos.`);
        return;
      }
    }

    // Navigate to template selector or editor
    router.push('/editor/new');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>No tienes proyectos aún</Text>
      <Text style={styles.emptyText}>
        Crea tu primera invitación hermosa
      </Text>
      <Pressable style={styles.createButtonLarge} onPress={handleCreateProject}>
        <Text style={styles.createButtonText}>Crear Invitación</Text>
      </Pressable>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Error</Text>
      <Text style={styles.errorText}>{error}</Text>
      <Pressable style={styles.retryButton} onPress={loadProjects}>
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </Pressable>
    </View>
  );

  if (isLoading && projects.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285f4" />
          <Text style={styles.loadingText}>Cargando proyectos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && projects.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.name?.split(' ')[0] || 'Usuario'}</Text>
          <Text style={styles.subtitle}>
            {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}
          </Text>
        </View>
        <Pressable style={styles.createButton} onPress={handleCreateProject}>
          <Text style={styles.createButtonIcon}>+</Text>
        </Pressable>
      </View>

      {/* Projects List */}
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          projects.length === 0 && styles.listEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#4285f4"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#4285f4',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  list: {
    padding: 20,
  },
  listEmpty: {
    flexGrow: 1,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButtonLarge: {
    backgroundColor: '#4285f4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
