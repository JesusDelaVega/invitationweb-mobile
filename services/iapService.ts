// In-App Purchase Service - Apple & Google Play
import {
  initConnection,
  endConnection,
  purchaseUpdatedListener,
  purchaseErrorListener,
  requestPurchase,
  finishTransaction,
  Purchase,
  PurchaseError,
} from 'react-native-iap';
import { Platform, Alert } from 'react-native';
import { ApiService } from './api';
import { PlanId } from '@/shared';

// Product IDs for iOS and Android
const PRODUCT_IDS = {
  ios: {
    paid_single: 'com.invitationweb.basic',      // $15 USD
    paid_double: 'com.invitationweb.standard',   // $25 USD
    creative_design: 'com.invitationweb.creative' // $70 USD
  },
  android: {
    paid_single: 'basic_plan',
    paid_double: 'standard_plan',
    creative_design: 'creative_plan'
  }
};

class IAPService {
  private purchaseUpdateSubscription: any = null;
  private purchaseErrorSubscription: any = null;
  private isInitialized = false;

  /**
   * Initialize IAP connection
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await initConnection();
      this.isInitialized = true;

      // Listen for purchase updates
      this.purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: Purchase) => {
          await this.handlePurchaseUpdate(purchase);
        }
      );

      // Listen for purchase errors
      this.purchaseErrorSubscription = purchaseErrorListener(
        (error: PurchaseError) => {
          console.error('Purchase error:', error);
          Alert.alert('Error en la compra', error.message);
        }
      );

      console.log('IAP initialized successfully');
    } catch (error) {
      console.error('Error initializing IAP:', error);
      throw error;
    }
  }

  /**
   * Get available products
   */
  async getAvailableProducts(): Promise<any[]> {
    try {
      // Note: This is a placeholder - react-native-iap API has changed
      // Will be implemented when IAP is fully configured
      return [];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  /**
   * Purchase a plan
   */
  async purchasePlan(planId: PlanId): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (planId === 'free') {
      Alert.alert('Error', 'El plan gratuito no requiere compra');
      return false;
    }

    try {
      const productId = Platform.OS === 'ios'
        ? PRODUCT_IDS.ios[planId as keyof typeof PRODUCT_IDS.ios]
        : PRODUCT_IDS.android[planId as keyof typeof PRODUCT_IDS.android];

      if (!productId) {
        throw new Error('Product ID not found for plan');
      }

      // Request purchase
      // Note: API signature may vary by react-native-iap version
      // @ts-ignore - API may vary between versions
      await requestPurchase({ sku: productId });

      // The actual purchase completion is handled in handlePurchaseUpdate
      return true;
    } catch (error: any) {
      console.error('Error purchasing plan:', error);

      // User cancelled
      if (error.code === 'E_USER_CANCELLED') {
        return false;
      }

      Alert.alert('Error', 'No se pudo completar la compra');
      return false;
    }
  }

  /**
   * Handle purchase update
   */
  private async handlePurchaseUpdate(purchase: Purchase): Promise<void> {
    try {
      // @ts-ignore - Purchase types may vary
      const transactionReceipt = purchase.transactionReceipt || purchase.purchaseToken;
      // @ts-ignore
      const productId = purchase.productId;

      if (!transactionReceipt) {
        console.error('No transaction receipt');
        return;
      }

      // Verify purchase with backend
      const endpoint = Platform.OS === 'ios'
        ? '/api/payment/verify-apple'
        : '/api/payment/verify-google';

      await ApiService.post(endpoint, {
        receipt: transactionReceipt,
        productId,
      });

      // Finish transaction
      await finishTransaction({ purchase });

      Alert.alert(
        '¡Compra exitosa!',
        'Tu plan ha sido actualizado correctamente',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error handling purchase update:', error);
      Alert.alert('Error', 'No se pudo verificar la compra. Contacta a soporte.');
    }
  }

  /**
   * Restore purchases (for iOS)
   */
  async restorePurchases(): Promise<void> {
    if (Platform.OS !== 'ios') {
      Alert.alert('Info', 'La restauración de compras solo está disponible en iOS');
      return;
    }

    try {
      // TODO: Implement restore purchases
      Alert.alert(
        'Próximamente',
        'La restauración de compras estará disponible próximamente'
      );
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert('Error', 'No se pudieron restaurar las compras');
    }
  }

  /**
   * Get product price by plan ID
   */
  async getPlanPrice(planId: PlanId): Promise<string | null> {
    // Placeholder - will be implemented with full IAP setup
    return null;
  }

  /**
   * Cleanup on unmount
   */
  async cleanup(): Promise<void> {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }

    if (this.isInitialized) {
      await endConnection();
      this.isInitialized = false;
    }
  }
}

export const iapService = new IAPService();
export default iapService;
