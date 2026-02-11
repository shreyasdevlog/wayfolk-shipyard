import { useState, useEffect, useCallback } from 'react';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import { Alert, Platform } from 'react-native';

const WAYFOLK_PRO_ENTITLEMENT = 'wayfolk_pro';
const BUILDER_CONNECTION_PRODUCT = 'builder_connection';

interface WayfolkProState {
  isProMember: boolean;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  error: string | null;
}

export function useWayfolkPro() {
  const [state, setState] = useState<WayfolkProState>({
    isProMember: false,
    isLoading: true,
    customerInfo: null,
    error: null,
  });

  // Check entitlement status
  const checkProStatus = useCallback(async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isProMember = Boolean(
        customerInfo.entitlements.active[WAYFOLK_PRO_ENTITLEMENT]
      );

      setState({
        isProMember,
        isLoading: false,
        customerInfo,
        error: null,
      });

      return isProMember;
    } catch (error) {
      console.error('Error checking Pro status:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check subscription status',
      }));
      return false;
    }
  }, []);

  // Purchase Wayfolk Pro subscription
  const purchaseProSubscription = useCallback(
    async (pkg: PurchasesPackage): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        const isProMember = Boolean(
          customerInfo.entitlements.active[WAYFOLK_PRO_ENTITLEMENT]
        );

        setState({
          isProMember,
          isLoading: false,
          customerInfo,
          error: null,
        });

        if (isProMember) {
          Alert.alert(
            '✨ Welcome to Wayfolk Pro!',
            'Your subscription is now active. Enjoy unlimited features!',
            [{ text: 'Get Started', style: 'default' }]
          );
          return true;
        }

        return false;
      } catch (error: any) {
        setState((prev) => ({ ...prev, isLoading: false }));

        if (!error.userCancelled) {
          let errorMessage = 'Unable to complete purchase';

          if (error.code === 'PURCHASE_NOT_ALLOWED_ERROR') {
            errorMessage = 'Purchases are not allowed on this device';
          } else if (error.code === 'PAYMENT_PENDING_ERROR') {
            errorMessage = 'Payment is pending. Please check back later';
          } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your connection';
          }

          Alert.alert('Purchase Failed', errorMessage, [
            { text: 'OK', style: 'default' },
          ]);
        }

        return false;
      }
    },
    []
  );

  // Purchase Builder Connection (one-time)
  const purchaseBuilderConnection = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Get offerings to find the builder connection product
      const offerings = await Purchases.getOfferings();
      const builderPackage = offerings.current?.availablePackages.find(
        (pkg) =>
          pkg.product.identifier === BUILDER_CONNECTION_PRODUCT ||
          pkg.identifier.includes('builder')
      );

      if (!builderPackage) {
        throw new Error('Builder connection product not found');
      }

      const { customerInfo } = await Purchases.purchasePackage(builderPackage);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        customerInfo,
      }));

      return true;
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));

      if (!error.userCancelled) {
        let errorMessage = 'Unable to complete purchase';

        if (error.code === 'PURCHASE_NOT_ALLOWED_ERROR') {
          errorMessage = 'Purchases are not allowed on this device';
        } else if (error.code === 'PAYMENT_PENDING_ERROR') {
          errorMessage = 'Payment is pending. Please check back later';
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = 'Network error. Please check your connection';
        }

        Alert.alert('Purchase Failed', errorMessage, [
          { text: 'OK', style: 'default' },
        ]);
      }

      return false;
    }
  }, []);

  // Restore purchases
  const restorePurchases = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const customerInfo = await Purchases.restorePurchases();
      const isProMember = Boolean(
        customerInfo.entitlements.active[WAYFOLK_PRO_ENTITLEMENT]
      );

      setState({
        isProMember,
        isLoading: false,
        customerInfo,
        error: null,
      });

      if (isProMember) {
        Alert.alert(
          'Purchases Restored',
          'Your Wayfolk Pro subscription has been restored!',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any purchases to restore.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      setState((prev) => ({ ...prev, isLoading: false }));

      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  }, []);

  // Fetch customer info on mount
  useEffect(() => {
    checkProStatus();
  }, [checkProStatus]);

  return {
    isProMember: state.isProMember,
    isLoading: state.isLoading,
    customerInfo: state.customerInfo,
    error: state.error,
    purchaseProSubscription,
    purchaseBuilderConnection,
    restorePurchases,
    checkProStatus,
  };
}
