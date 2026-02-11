import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { useWayfolkPro } from '../hooks/useWayfolkPro';

interface Feature {
  id: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    id: 1,
    icon: 'infinite',
    title: 'Unlimited Roamantic Swipes',
    description: 'Connect with travelers without limits',
  },
  {
    id: 2,
    icon: 'eye-off',
    title: 'Incognito Mode',
    description: 'Browse profiles privately and discreetly',
  },
  {
    id: 3,
    icon: 'filter',
    title: 'Advanced Route Filtering',
    description: 'Find perfect matches on your path',
  },
  {
    id: 4,
    icon: 'construct',
    title: '1 Free Builder Consultation',
    description: 'Expert help every month, on us',
  },
];

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { purchaseProSubscription, isLoading: isPurchasing } = useWayfolkPro();

  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setOfferings(offerings.current);

        // Auto-select the annual package (best value) if available
        const annualPkg = offerings.current.availablePackages.find(
          (pkg) => pkg.packageType === 'ANNUAL'
        );
        setSelectedPackage(annualPkg || offerings.current.availablePackages[0] || null);
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    const success = await purchaseProSubscription(selectedPackage);
    if (success) {
      router.back();
    }
  };

  const handleRestore = async () => {
    try {
      setIsLoading(true);
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active['wayfolk_pro']) {
        router.back();
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPackagePrice = (pkg: PurchasesPackage) => {
    return pkg.product.priceString;
  };

  const getPackageTitle = (pkg: PurchasesPackage) => {
    switch (pkg.packageType) {
      case 'MONTHLY':
        return 'Monthly';
      case 'ANNUAL':
        return 'Yearly';
      case 'LIFETIME':
        return 'Lifetime';
      default:
        return pkg.identifier;
    }
  };

  const getPackageSubtitle = (pkg: PurchasesPackage) => {
    switch (pkg.packageType) {
      case 'MONTHLY':
        return 'Billed monthly';
      case 'ANNUAL':
        return 'Best Value - Save 40%';
      case 'LIFETIME':
        return 'Pay once, own forever';
      default:
        return '';
    }
  };

  const isYearlyPackage = (pkg: PurchasesPackage) => {
    return pkg.packageType === 'ANNUAL';
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/paywall/hero-background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay for Text Legibility */}
        <LinearGradient
          colors={['rgba(27, 43, 33, 0.3)', 'rgba(27, 43, 33, 0.85)', '#1B2B21']}
          style={styles.gradientOverlay}
          locations={[0, 0.4, 0.7]}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={[styles.closeButton, { top: insets.top + 16 }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#D9C5B2" />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: insets.top + 80, paddingBottom: insets.bottom + 120 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.proBadge}>
                <LinearGradient
                  colors={['#FF7043', '#FF5722']}
                  style={styles.proBadgeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="star" size={20} color="#FFFFFF" />
                  <Text style={styles.proBadgeText}>PRO</Text>
                </LinearGradient>
              </View>

              <Text style={styles.heroTitle}>Elevate Your Journey</Text>
              <Text style={styles.heroSubtitle}>
                Unlock the full Wayfolk experience and travel without limits
              </Text>
            </View>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              {FEATURES.map((feature) => (
                <View key={feature.id} style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <LinearGradient
                      colors={['#FF7043', '#FF5722']}
                      style={styles.featureIconGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name={feature.icon} size={24} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
              ))}
            </View>

            {/* Pricing Packages */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF7043" />
                <Text style={styles.loadingText}>Loading plans...</Text>
              </View>
            ) : (
              <View style={styles.packagesContainer}>
                <Text style={styles.packagesTitle}>Choose Your Plan</Text>
                {offerings?.availablePackages.map((pkg) => (
                  <TouchableOpacity
                    key={pkg.identifier}
                    style={[
                      styles.packageCard,
                      selectedPackage?.identifier === pkg.identifier &&
                        styles.packageCardSelected,
                      isYearlyPackage(pkg) && styles.packageCardBestValue,
                    ]}
                    onPress={() => setSelectedPackage(pkg)}
                    activeOpacity={0.8}
                  >
                    {isYearlyPackage(pkg) && (
                      <View style={styles.bestValueBadge}>
                        <Text style={styles.bestValueText}>BEST VALUE</Text>
                      </View>
                    )}

                    <View style={styles.packageHeader}>
                      <View style={styles.packageLeft}>
                        <Text style={styles.packageTitle}>{getPackageTitle(pkg)}</Text>
                        <Text style={styles.packageSubtitle}>{getPackageSubtitle(pkg)}</Text>
                      </View>
                      <View style={styles.packageRight}>
                        <Text style={styles.packagePrice}>{getPackagePrice(pkg)}</Text>
                      </View>
                    </View>

                    <View style={styles.radioContainer}>
                      <View
                        style={[
                          styles.radioOuter,
                          selectedPackage?.identifier === pkg.identifier &&
                            styles.radioOuterSelected,
                        ]}
                      >
                        {selectedPackage?.identifier === pkg.identifier && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Trust Indicators */}
            <View style={styles.trustContainer}>
              <View style={styles.trustRow}>
                <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
                <Text style={styles.trustText}>Cancel anytime</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustRow}>
                <Ionicons name="lock-closed" size={16} color="#4CAF50" />
                <Text style={styles.trustText}>Secure payment</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustRow}>
                <Ionicons name="refresh" size={16} color="#4CAF50" />
                <Text style={styles.trustText}>Money-back guarantee</Text>
              </View>
            </View>

            {/* Restore Purchases Link */}
            <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* CTA Button - Fixed at Bottom */}
          <View
            style={[
              styles.ctaContainer,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.ctaButton,
                (!selectedPackage || isPurchasing) && styles.ctaButtonDisabled,
              ]}
              onPress={handlePurchase}
              disabled={!selectedPackage || isPurchasing}
              activeOpacity={0.8}
            >
              {isPurchasing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="rocket" size={24} color="#FFFFFF" />
                  <Text style={styles.ctaButtonText}>Start Your Journey</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.ctaSubtext}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2B21',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(27, 43, 33, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  proBadge: {
    marginBottom: 20,
  },
  proBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
  },
  proBadgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#D9C5B2',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: 17,
    fontWeight: '500',
    color: 'rgba(217, 197, 178, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // Features
  featuresContainer: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 197, 178, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(217, 197, 178, 0.2)',
  },
  featureIconContainer: {
    marginRight: 16,
  },
  featureIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D9C5B2',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  featureDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(217, 197, 178, 0.7)',
    lineHeight: 18,
  },

  // Packages
  packagesContainer: {
    marginBottom: 24,
  },
  packagesTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#D9C5B2',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(217, 197, 178, 0.7)',
    marginTop: 12,
  },
  packageCard: {
    backgroundColor: 'rgba(217, 197, 178, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(217, 197, 178, 0.2)',
    position: 'relative',
  },
  packageCardSelected: {
    backgroundColor: 'rgba(217, 197, 178, 0.25)',
    borderColor: '#FF7043',
  },
  packageCardBestValue: {
    borderColor: '#FF7043',
    borderWidth: 3,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FF7043',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageLeft: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#D9C5B2',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  packageSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(217, 197, 178, 0.7)',
  },
  packageRight: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF7043',
    letterSpacing: 0.5,
  },
  radioContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(217, 197, 178, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#FF7043',
    borderWidth: 3,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF7043',
  },

  // Trust Indicators
  trustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(217, 197, 178, 0.8)',
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(217, 197, 178, 0.3)',
    marginHorizontal: 12,
  },

  // Restore Button
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(217, 197, 178, 0.7)',
    textDecorationLine: 'underline',
  },

  // CTA
  ctaContainer: {
    backgroundColor: 'rgba(27, 43, 33, 0.95)',
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(217, 197, 178, 0.1)',
  },
  ctaButton: {
    backgroundColor: '#FF7043',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  ctaButtonDisabled: {
    backgroundColor: 'rgba(255, 112, 67, 0.3)',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  ctaSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(217, 197, 178, 0.5)',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 15,
  },
});
