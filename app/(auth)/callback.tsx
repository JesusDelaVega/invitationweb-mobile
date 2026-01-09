// OAuth Callback Screen
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../store/authStore';

export default function CallbackScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { login, error } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(true);

  useEffect(() => {
    if (code) {
      handleLogin(code);
    } else {
      router.replace('/(auth)/login');
    }
  }, [code]);

  const handleLogin = async (authCode: string) => {
    try {
      setIsProcessing(true);
      await login(authCode);

      // Login successful - navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      setIsProcessing(false);

      // Show error for 3 seconds, then go back to login
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isProcessing ? (
          <>
            <ActivityIndicator size="large" color="#4285f4" />
            <Text style={styles.text}>Iniciando sesión...</Text>
          </>
        ) : error ? (
          <>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.redirectText}>Redirigiendo...</Text>
          </>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  redirectText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});
