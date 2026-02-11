import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useWayfolkPro } from "../hooks/useWayfolkPro";

interface VagabondStat {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: number;
  label: string;
}

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isProMember } = useWayfolkPro();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationPrivacy, setLocationPrivacy] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState("+1 (555) 123-4567");

  const vagabondStats: VagabondStat[] = [
    { icon: "shield-checkmark", value: 42, label: "Vouches" },
    { icon: "trail-sign", value: 12847, label: "Miles" },
    { icon: "people", value: 18, label: "Convoys" },
  ];

  const activityHistory: ActivityItem[] = [
    {
      id: "1",
      title: "Joshua Tree Convoy",
      date: "Jan 2026",
      icon: "location",
      color: "#FF7043",
    },
    {
      id: "2",
      title: "Solar Panel Fix - Big Sur",
      date: "Dec 2025",
      icon: "construct",
      color: "#FFB800",
    },
    {
      id: "3",
      title: "Pacific Coast Meetup",
      date: "Nov 2025",
      icon: "people",
      color: "#4CAF50",
    },
    {
      id: "4",
      title: "Diesel Heater Install",
      date: "Oct 2025",
      icon: "flame",
      color: "#FF5722",
    },
  ];

  const handleLogOut = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            // TODO: Implement actual logout logic
            console.log("User logged out");
            Alert.alert("Logged Out", "You have been logged out successfully.");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpgrade = () => {
    router.push("/paywall");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={28} color="#D9C5B2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
              }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          </View>
          <Text style={styles.userName}>Alex Rivers</Text>
          <Text style={styles.memberSince}>Member since June 2024</Text>
          <View style={styles.verifiedPill}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.verifiedText}>Verified Vagabond</Text>
          </View>
        </View>

        {/* Vagabond Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Vagabond Stats</Text>
          <View style={styles.statsGrid}>
            {vagabondStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name={stat.icon} size={28} color="#FF7043" />
                </View>
                <Text style={styles.statValue}>{stat.value.toLocaleString()}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscription Status Card */}
        {isProMember ? (
          <View style={styles.subscriptionCard}>
            <LinearGradient
              colors={["#FF7043", "#FF5722"]}
              style={styles.proCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.proHeader}>
                <View style={styles.proBadge}>
                  <Ionicons name="star" size={20} color="#FF7043" />
                  <Text style={styles.proBadgeText}>PRO</Text>
                </View>
                <Ionicons name="rocket" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.proTitle}>Wayfolk Pro</Text>
              <Text style={styles.proSubtitle}>
                Unlimited features & priority support
              </Text>
            </LinearGradient>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.freeCard}
            onPress={handleUpgrade}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#2A3B31", "#1B2B21"]}
              style={styles.freeCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.freeHeader}>
                <View>
                  <Text style={styles.freeTitle}>Free Tier</Text>
                  <Text style={styles.freeSubtitle}>
                    Limited features available
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Activity History */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Past Trips & Fixes</Text>
          {activityHistory.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: `${activity.color}20` },
                ]}
              >
                <Ionicons name={activity.icon} size={20} color={activity.color} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D9C5B2" />
            </View>
          ))}
        </View>

        {/* Essential Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="notifications"
                  size={20}
                  color="#D9C5B2"
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingSubtitle}>
                    Get notified about messages
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#2A3B31", true: "#FF7043" }}
                thumbColor={pushNotifications ? "#FFFFFF" : "#D9C5B2"}
                ios_backgroundColor="#2A3B31"
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="location"
                  size={20}
                  color="#D9C5B2"
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={styles.settingTitle}>Location Privacy</Text>
                  <Text style={styles.settingSubtitle}>
                    Hide exact location
                  </Text>
                </View>
              </View>
              <Switch
                value={locationPrivacy}
                onValueChange={setLocationPrivacy}
                trackColor={{ false: "#2A3B31", true: "#FF7043" }}
                thumbColor={locationPrivacy ? "#FFFFFF" : "#D9C5B2"}
                ios_backgroundColor="#2A3B31"
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowBorder]}>
              <View style={styles.emergencyContactContainer}>
                <View style={styles.emergencyHeader}>
                  <Ionicons
                    name="call"
                    size={20}
                    color="#D9C5B2"
                    style={styles.settingIcon}
                  />
                  <Text style={styles.settingTitle}>Emergency Contact</Text>
                </View>
                <TextInput
                  style={styles.emergencyInput}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  placeholder="Enter phone number"
                  placeholderTextColor="rgba(217, 197, 178, 0.4)"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#D9C5B2" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#D9C5B2",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Identity Card
  identityCard: {
    backgroundColor: "#D9C5B2",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5D4C1",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B2B21",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  memberSince: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(27, 43, 33, 0.6)",
    marginBottom: 12,
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50",
    letterSpacing: 0.3,
  },

  // Subscription Status
  subscriptionCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  proCardGradient: {
    padding: 20,
  },
  proHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  proBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FF7043",
    letterSpacing: 1,
  },
  proTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  proSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
  },
  freeCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  freeCardGradient: {
    padding: 20,
    borderWidth: 2,
    borderColor: "#2A3B31",
    borderRadius: 16,
  },
  freeHeader: {
    marginBottom: 16,
  },
  freeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D9C5B2",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  freeSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(217, 197, 178, 0.6)",
  },
  upgradeButton: {
    backgroundColor: "#FF7043",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // Vagabond Stats
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#D9C5B2",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#2A3B31",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 112, 67, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#D9C5B2",
    textAlign: "center",
    lineHeight: 14,
  },

  // Activity History
  activitySection: {
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A3B31",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#D9C5B2",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  activityDate: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(217, 197, 178, 0.6)",
  },

  // Settings
  settingsSection: {
    marginBottom: 24,
  },
  settingCard: {
    backgroundColor: "#2A3B31",
    borderRadius: 16,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "rgba(217, 197, 178, 0.1)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#D9C5B2",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(217, 197, 178, 0.5)",
  },
  emergencyContactContainer: {
    flex: 1,
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emergencyInput: {
    backgroundColor: "rgba(27, 43, 33, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#D9C5B2",
    borderWidth: 1,
    borderColor: "rgba(217, 197, 178, 0.1)",
  },

  // Log Out
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D9C5B2",
    letterSpacing: 0.2,
  },
});
