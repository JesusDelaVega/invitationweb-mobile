// Plans Screen - View and purchase plans
import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useUser } from '../store/authStore';
import { PLAN_LIMITS, PlanId } from '@logowebmx/shared';
import { iapService } from '../services/iapService';

interface PlanCardProps {
  planId: PlanId;
  isCurrentPlan: boolean;
  onSelectPlan: (planId: PlanId) => void;
}

function PlanCard({ planId, isCurrentPlan, onSelectPlan }: PlanCardProps) {
  const plan = PLAN_LIMITS[planId];

  if (!plan) return null;

  const features = [
    plan.can_publish
      ? `Publicar ${plan.max_published_projects} ${plan.max_published_projects === 1 ? 'proyecto' : 'proyectos'}`
      : 'No puede publicar',
    plan.max_drafts
      ? `${plan.max_drafts} ${plan.max_drafts === 1 ? 'borrador' : 'borradores'}`
      : 'Borradores ilimitados',
    plan.can_edit ? 'Edición completa' : 'Solo lectura',
  ];

  const isFreePlan = planId === 'free';
  const isPremiumPlan = !isFreePlan;

  return (
    <View style={[styles.planCard, isCurrentPlan && styles.planCardCurrent]}>
      {isCurrentPlan && (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>Plan Actual</Text>
        </View>
      )}

      <Text style={styles.planName}>{plan.name}</Text>
      <Text style={styles.planDescription}>{plan.description}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.priceSymbol}>$</Text>
        <Text style={styles.priceAmount}>{plan.price}</Text>
        <Text style={styles.priceCurrency}>MXN</Text>
      </View>

      {plan.priceUSD > 0 && (
        <Text style={styles.priceUSD}>${plan.priceUSD} USD</Text>
      )}

      {isFreePlan ? (
        <Text style={styles.freeText}>Gratis para siempre</Text>
      ) : (
        <Text style={styles.paymentType}>Pago único</Text>
      )}

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.featureIcon}>
              {isPremiumPlan ? '✓' : '○'}
            </Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {!isCurrentPlan && isPremiumPlan && (
        <Pressable
          style={styles.selectButton}
          onPress={() => onSelectPlan(planId)}
        >
          <Text style={styles.selectButtonText}>Seleccionar plan</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function PlansScreen() {
  const router = useRouter();
  const user = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = user?.current_plan || 'free';

  // Initialize IAP on mount
  React.useEffect(() => {
    iapService.initialize().catch(console.error);
    return () => {
      iapService.cleanup().catch(console.error);
    };
  }, []);

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === 'free') return;

    setIsProcessing(true);

    try {
      // Attempt to purchase via IAP
      const success = await iapService.purchasePlan(planId);

      if (success) {
        // Purchase initiated, completion handled in iapService
        Alert.alert(
          'Procesando compra',
          'Tu compra está siendo procesada. Recibirás una confirmación pronto.'
        );
      }
    } catch (error) {
      console.error('Error purchasing plan:', error);
      Alert.alert('Error', 'No se pudo iniciar la compra');
    } finally {
      setIsProcessing(false);
    }
  };

  const plans: PlanId[] = ['free', 'paid_single', 'paid_double', 'creative_design'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Planes</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Elige el plan perfecto para ti</Text>
        <Text style={styles.subtitle}>
          Todos los planes incluyen acceso completo al editor y plantillas
        </Text>

        {plans.map((planId) => (
          <PlanCard
            key={planId}
            planId={planId}
            isCurrentPlan={planId === currentPlan}
            onSelectPlan={handleSelectPlan}
          />
        ))}

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 ¿Necesitas ayuda?</Text>
          <Text style={styles.infoText}>
            Si tienes dudas sobre cuál plan elegir, contáctanos y te ayudaremos a
            encontrar la mejor opción para ti.
          </Text>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  planCardCurrent: {
    borderColor: '#4285f4',
    backgroundColor: '#eff6ff',
  },
  currentBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4285f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  priceSymbol: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    marginHorizontal: 4,
  },
  priceCurrency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
  },
  priceUSD: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  freeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 20,
  },
  paymentType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    color: '#10b981',
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
