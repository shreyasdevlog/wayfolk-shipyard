import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useWayfolkPro } from "../../hooks/useWayfolkPro";
import { LinearGradient } from "expo-linear-gradient";

type TrustIndicator = {
  id: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  status: "verified" | "pending" | "unverified";
};

export default function MyRouteScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isProMember } = useWayfolkPro();
  const [currentBase, setCurrentBase] = useState("Lisbon, Portugal");
  const [nextDestination, setNextDestination] = useState("Barcelona, Spain");

  const trustIndicators: TrustIndicator[] = [
    {
      id: "instagram",
      icon: "logo-instagram",
      label: "Link Instagram",
      status: "verified",
    },
    {
      id: "tiktok",
      icon: "logo-tiktok",
      label: "Link TikTok",
      status: "pending",
    },
    {
      id: "phone",
      icon: "call",
      label: "Phone Verification",
      status: "verified",
    },
  ];

  const getStatusColor = (status: TrustIndicator["status"]) => {
    switch (status) {
      case "verified":
        return "#4CAF50";
      case "pending":
        return "#FF7043";
      case "unverified":
        return "#757575";
    }
  };

  const getStatusLabel = (status: TrustIndicator["status"]) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending";
      case "unverified":
        return "Connect";
    }
  };

  const handleManageSubscription = () => {
    const isIOS = Platform.OS === 'ios';
    const title = 'Manage Your Subscription';
    const message = isIOS
      ? 'You can manage your subscription in the App Store. Would you like to open it now?'
      : 'You can manage your subscription in the Play Store. Would you like to open it now?';

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: async () => {
          try {
            const url = isIOS
              ? 'https://apps.apple.com/account/subscriptions'
              : 'https://play.google.com/store/account/subscriptions';
            await Linking.openURL(url);
          } catch (error) {
            console.error('Error opening subscription management:', error);
          }
        },
      },
    ]);
  };

  const handleUpgradeToPro = () => {
    router.push('/paywall');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Route</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Pro Membership Card */}
        {isProMember ? (
          <View style={styles.proCard}>
            <LinearGradient
              colors={['#FF7043', '#FF5722']}
              style={styles.proCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.proCardHeader}>
                <View style={styles.proCardLeft}>
                  <View style={styles.proBadge}>
                    <Ionicons name="star" size={20} color="#FF7043" />
                    <Text style={styles.proBadgeText}>PRO</Text>
                  </View>
                  <Text style={styles.proCardTitle}>Wayfolk Pro Member</Text>
                  <Text style={styles.proCardSubtext}>
                    Enjoying unlimited features
                  </Text>
                </View>
                <Ionicons name="rocket" size={32} color="#FFFFFF" />
              </View>

              <TouchableOpacity
                style={styles.manageButton}
                onPress={handleManageSubscription}
                activeOpacity={0.8}
              >
                <Ionicons name="settings-outline" size={18} color="#FF7043" />
                <Text style={styles.manageButtonText}>Manage Subscription</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={handleUpgradeToPro}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#FF7043', '#FF5722']}
              style={styles.upgradeCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.upgradeCardContent}>
                <View style={styles.upgradeIconContainer}>
                  <Ionicons name="rocket" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.upgradeTextContainer}>
                  <Text style={styles.upgradeTitle}>Upgrade to Wayfolk Pro</Text>
                  <Text style={styles.upgradeSubtext}>
                    Unlock unlimited features and perks
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Travel Status Card */}
        <View style={styles.travelCard}>
          <Text style={styles.cardTitle}>Travel Itinerary</Text>

          {/* Current Base */}
          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={20} color="#1B2B21" />
              <Text style={styles.locationLabel}>Current Base</Text>
            </View>
            <TextInput
              style={styles.input}
              value={currentBase}
              onChangeText={setCurrentBase}
              placeholder="Enter your current location"
              placeholderTextColor="rgba(27, 43, 33, 0.4)"
            />
          </View>

          {/* Connecting Line */}
          <View style={styles.connectionContainer}>
            <View style={styles.dottedLine} />
            <View style={styles.arrowContainer}>
              <Ionicons name="airplane" size={20} color="#FF7043" />
            </View>
          </View>

          {/* Next Destination */}
          <View style={styles.locationContainer}>
            <View style={styles.locationHeader}>
              <Ionicons name="flag" size={20} color="#1B2B21" />
              <Text style={styles.locationLabel}>Next Destination</Text>
            </View>
            <TextInput
              style={styles.input}
              value={nextDestination}
              onChangeText={setNextDestination}
              placeholder="Where are you headed?"
              placeholderTextColor="rgba(27, 43, 33, 0.4)"
            />
          </View>

          {/* Update Path Button */}
          <TouchableOpacity style={styles.updateButton} activeOpacity={0.8}>
            <Text style={styles.updateButtonText}>Update Path</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Community Standing Section */}
        <View style={styles.standingCard}>
          <Text style={styles.cardTitle}>Community Standing</Text>

          {/* Vouch Count */}
          <View style={styles.vouchContainer}>
            <View style={styles.vouchBadge}>
              <Ionicons name="shield-checkmark" size={48} color="#FF7043" />
            </View>
            <View style={styles.vouchTextContainer}>
              <Text style={styles.vouchCount}>42 Vouches</Text>
              <Text style={styles.vouchSubtext}>
                Trusted by the community
              </Text>
            </View>
          </View>

          {/* Trust Indicators */}
          <View style={styles.indicatorsContainer}>
            <Text style={styles.indicatorsTitle}>Trust Indicators</Text>
            {trustIndicators.map((indicator) => (
              <View key={indicator.id} style={styles.indicatorRow}>
                <View style={styles.indicatorLeft}>
                  <View style={styles.indicatorIconContainer}>
                    <Ionicons
                      name={indicator.icon}
                      size={20}
                      color="#1B2B21"
                    />
                  </View>
                  <Text style={styles.indicatorLabel}>{indicator.label}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: getStatusColor(indicator.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusLabel(indicator.status)}
                  </Text>
                  {indicator.status === "verified" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#FFFFFF"
                      style={styles.statusIcon}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Invite Friends Card */}
        <View style={styles.inviteCard}>
          <View style={styles.inviteHeader}>
            <Ionicons name="people" size={32} color="#1B2B21" />
            <View style={styles.inviteTextContainer}>
              <Text style={styles.inviteTitle}>Exclusive Community</Text>
              <Text style={styles.inviteSubtext}>
                You have <Text style={styles.inviteCount}>3 Invites</Text>{" "}
                remaining
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.inviteButton}
            activeOpacity={0.8}
          >
            <Ionicons name="link" size={18} color="#FFFFFF" />
            <Text style={styles.inviteButtonText}>Generate Invite Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2B21",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D9C5B2",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Pro Membership Card Styles
  proCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  proCardGradient: {
    padding: 20,
  },
  proCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  proCardLeft: {
    flex: 1,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 6,
  },
  proBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF7043',
    letterSpacing: 1,
  },
  proCardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  proCardSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  manageButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  manageButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF7043',
    letterSpacing: 0.2,
  },

  // Upgrade Card Styles
  upgradeCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  upgradeCardGradient: {
    padding: 20,
  },
  upgradeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  upgradeTextContainer: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  upgradeSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Travel Card Styles
  travelCard: {
    backgroundColor: "#D9C5B2",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B2B21",
    marginBottom: 16,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B2B21",
    marginLeft: 6,
    opacity: 0.7,
  },
  input: {
    backgroundColor: "rgba(27, 43, 33, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#1B2B21",
    borderWidth: 1,
    borderColor: "rgba(27, 43, 33, 0.1)",
  },
  connectionContainer: {
    alignItems: "center",
    marginVertical: 12,
    position: "relative",
  },
  dottedLine: {
    width: 2,
    height: 40,
    borderLeftWidth: 2,
    borderLeftColor: "#FF7043",
    borderStyle: "dotted",
  },
  arrowContainer: {
    position: "absolute",
    top: "50%",
    marginTop: -10,
  },
  updateButton: {
    backgroundColor: "#FF7043",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 8,
  },

  // Community Standing Styles
  standingCard: {
    backgroundColor: "#D9C5B2",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  vouchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 43, 33, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  vouchBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 112, 67, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  vouchTextContainer: {
    flex: 1,
  },
  vouchCount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B2B21",
    marginBottom: 2,
  },
  vouchSubtext: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(27, 43, 33, 0.6)",
  },
  indicatorsContainer: {
    marginTop: 4,
  },
  indicatorsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B2B21",
    marginBottom: 12,
  },
  indicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(27, 43, 33, 0.05)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  indicatorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indicatorIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(27, 43, 33, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  indicatorLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B2B21",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statusIcon: {
    marginLeft: 4,
  },

  // Invite Card Styles
  inviteCard: {
    backgroundColor: "#D9C5B2",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  inviteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  inviteTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B2B21",
    marginBottom: 4,
  },
  inviteSubtext: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(27, 43, 33, 0.6)",
  },
  inviteCount: {
    fontWeight: "800",
    color: "#FF7043",
  },
  inviteButton: {
    backgroundColor: "#FF7043",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },
});
