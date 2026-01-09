// Project Card Component
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { Project } from '@/shared';
import { formatDate } from '@/shared';
import { useRouter } from 'expo-router';

interface ProjectCardProps {
  project: Project;
  onPress?: () => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to editor
      router.push({
        pathname: '/editor/[id]',
        params: { id: project.id },
      });
    }
  };

  // Parse website_data if it's a string
  const websiteData = typeof project.website_data === 'string'
    ? JSON.parse(project.website_data)
    : project.website_data;

  const backgroundImage = websiteData?.hero?.backgroundImage;
  const title = typeof websiteData?.hero?.title === 'string'
    ? websiteData.hero.title
    : websiteData?.hero?.title?.es || websiteData?.hero?.title?.en || 'Sin título';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnail}>
        {backgroundImage ? (
          <Image
            source={{ uri: backgroundImage }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.placeholderIcon}>📝</Text>
          </View>
        )}

        {/* Published Badge */}
        {project.is_published && (
          <View style={styles.publishedBadge}>
            <Text style={styles.publishedText}>✓ Publicado</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {project.description && (
          <Text style={styles.description} numberOfLines={1}>
            {project.description}
          </Text>
        )}

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            {formatDate(project.updated_at || project.created_at, 'short')}
          </Text>

          {project.is_published && project.published_url && (
            <>
              <Text style={styles.metaSeparator}>•</Text>
              <Text style={styles.metaLink} numberOfLines={1}>
                {project.published_url}
              </Text>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.9,
  },
  thumbnail: {
    height: 160,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    opacity: 0.5,
  },
  publishedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  publishedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  metaSeparator: {
    fontSize: 12,
    color: '#d1d5db',
    marginHorizontal: 6,
  },
  metaLink: {
    fontSize: 12,
    color: '#3b82f6',
    flex: 1,
  },
});
