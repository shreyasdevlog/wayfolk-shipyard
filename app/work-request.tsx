import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useWayfolkPro } from "../hooks/useWayfolkPro";

// Problem tag options
const PROBLEM_TAGS = [
  { id: 1, label: "⚡️ Electrical", value: "electrical" },
  { id: 2, label: "💧 Leaky Roof", value: "leaky_roof" },
  { id: 3, label: "🔥 Diesel Heater", value: "diesel_heater" },
  { id: 4, label: "💨 Engine Smoke", value: "engine_smoke" },
  { id: 5, label: "🔧 Plumbing", value: "plumbing" },
  { id: 6, label: "☀️ Solar", value: "solar" },
  { id: 7, label: "❄️ HVAC", value: "hvac" },
  { id: 8, label: "🛠️ Carpentry", value: "carpentry" },
];

// Urgency levels
const URGENCY_LEVELS = [
  {
    id: 1,
    label: "Low",
    sublabel: "Within a week",
    value: "low",
    icon: "calendar-outline",
  },
  {
    id: 2,
    label: "Medium",
    sublabel: "2-3 days",
    value: "medium",
    icon: "time-outline",
  },
  {
    id: 3,
    label: "High",
    sublabel: "Need help now!",
    value: "high",
    icon: "alert-circle",
  },
];

export default function WorkRequestScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isProMember, isLoading: isCheckingPro, purchaseBuilderConnection } = useWayfolkPro();

  // Extract builder info from params
  const builderName = (params.name as string) || "Builder";
  const builderImage = params.imageUrl as string;
  const hourlyRate = parseInt((params.hourlyRate as string) || "0", 10);
  const builderId = params.id as string;

  // Form state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<string>("medium");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const bookingFee = 9.99;

  const toggleTag = (tagValue: string) => {
    if (selectedTags.includes(tagValue)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagValue));
    } else {
      setSelectedTags([...selectedTags, tagValue]);
    }
  };

  const handleSubmit = async () => {
    // Check if user has Pro membership
    if (isProMember) {
      // Pro members get 1 free consultation per month
      // Navigate directly to the chat thread
      Alert.alert(
        '✨ Pro Member Benefit',
        'Your free monthly builder consultation has been activated!',
        [
          {
            text: 'Start Chat',
            onPress: () => {
              // Navigate to chat with builder
              router.push(`/chat/${builderId}`);
            },
          },
        ]
      );
      return;
    }

    // Non-Pro members need to purchase Builder Connection
    Alert.alert(
      'Builder Connection Required',
      `Connect with ${builderName} for a one-time fee of $${bookingFee.toFixed(2)}. This unlocks your conversation and shares your location with the builder.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: `Pay $${bookingFee.toFixed(2)}`,
          onPress: handleBuilderConnectionPurchase,
        },
      ]
    );
  };

  const handleBuilderConnectionPurchase = async () => {
    setIsPurchasing(true);

    try {
      const success = await purchaseBuilderConnection();

      if (success) {
        // Purchase successful - navigate to chat
        Alert.alert(
          'Connection Established! 🎉',
          `You can now chat with ${builderName} and share your location.`,
          [
            {
              text: 'Start Chat',
              onPress: () => {
                router.push(`/chat/${builderId}`);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const isFormValid = selectedTags.length > 0 && description.trim().length > 20;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#D9C5B2" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            {builderImage && (
              <Image
                source={{ uri: builderImage }}
                style={styles.builderThumbnail}
                resizeMode="cover"
              />
            )}
            {!builderImage && (
              <View style={[styles.builderThumbnail, styles.placeholderThumbnail]}>
                <Ionicons name="person" size={20} color="#1B2B21" />
              </View>
            )}
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Request Help</Text>
              <Text style={styles.headerSubtitle}>from {builderName}</Text>
            </View>
          </View>
        </View>

        {/* Issue Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What&apos;s the problem?</Text>
          <Text style={styles.sectionHint}>Select all that apply</Text>
          <View style={styles.tagsContainer}>
            {PROBLEM_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tagButton,
                  selectedTags.includes(tag.value) && styles.tagButtonSelected,
                ]}
                onPress={() => toggleTag(tag.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag.value) && styles.tagTextSelected,
                  ]}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Box */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Describe your issue in detail</Text>
          <Text style={styles.sectionHint}>
            Be specific about symptoms, when it started, and what you&apos;ve tried
          </Text>
          <View style={styles.descriptionContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Example: My diesel heater keeps cutting out after running for 10 minutes. I&apos;ve checked the fuel lines and they seem clear. The error code shows E-08..."
              placeholderTextColor="rgba(27, 43, 33, 0.4)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
            <Text
              style={[
                styles.characterCount,
                description.length >= 20 && styles.characterCountValid,
              ]}
            >
              {description.length} / 20 minimum
            </Text>
          </View>
        </View>

        {/* Urgency Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How urgent is this?</Text>
          <View style={styles.urgencyContainer}>
            {URGENCY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.urgencyButton,
                  urgency === level.value && styles.urgencyButtonSelected,
                  level.value === "high" && urgency === level.value && styles.urgencyButtonHigh,
                ]}
                onPress={() => setUrgency(level.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={level.icon as any}
                  size={24}
                  color={
                    urgency === level.value
                      ? level.value === "high"
                        ? "#FFFFFF"
                        : "#FF7043"
                      : "rgba(27, 43, 33, 0.5)"
                  }
                />
                <Text
                  style={[
                    styles.urgencyLabel,
                    urgency === level.value && styles.urgencyLabelSelected,
                    level.value === "high" && urgency === level.value && styles.urgencyLabelHigh,
                  ]}
                >
                  {level.label}
                </Text>
                <Text
                  style={[
                    styles.urgencySublabel,
                    urgency === level.value && styles.urgencySublabelSelected,
                    level.value === "high" && urgency === level.value && styles.urgencySublabelHigh,
                  ]}
                >
                  {level.sublabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Estimate Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceHeader}>
            <Ionicons name="receipt-outline" size={24} color="#1B2B21" />
            <Text style={styles.priceTitle}>Cost Breakdown</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Booking Fee</Text>
            <Text style={styles.priceValue}>${bookingFee.toFixed(2)}</Text>
          </View>

          <View style={styles.priceDivider} />

          <View style={styles.priceRow}>
            <View style={styles.priceRowLeft}>
              <Text style={styles.priceLabel}>Estimated Hourly Rate</Text>
              <Text style={styles.priceSubtext}>
                {builderName.split(" ")[0]}&apos;s rate
              </Text>
            </View>
            <Text style={styles.priceValueHighlight}>${hourlyRate}/hr</Text>
          </View>

          <View style={styles.securedBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#FF7043" />
            <Text style={styles.securedText}>Secured by Wayfolk</Text>
          </View>
        </View>

        {/* High Urgency Notice */}
        {urgency === "high" && (
          <View style={styles.urgencyNotice}>
            <Ionicons name="warning" size={20} color="#FF4444" />
            <Text style={styles.urgencyNoticeText}>
              High priority requests are typically responded to within 1-2 hours
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Call to Action - Fixed at bottom */}
      <View
        style={[
          styles.ctaContainer,
          {
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.ctaButton,
            (!isFormValid || isPurchasing || isCheckingPro) && styles.ctaButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || isPurchasing || isCheckingPro}
          activeOpacity={0.8}
        >
          {isPurchasing || isCheckingPro ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name={isProMember ? "checkmark-circle" : "card"}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.ctaButtonText}>
                {isProMember ? 'Confirm Request (Free)' : `Confirm & Pay $${bookingFee.toFixed(2)}`}
              </Text>
            </>
          )}
        </TouchableOpacity>
        {!isFormValid && (
          <Text style={styles.ctaHint}>
            Select at least one issue and provide a detailed description
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2B21",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(217, 197, 178, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  builderThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D9C5B2",
    borderWidth: 2,
    borderColor: "#FF7043",
  },
  placeholderThumbnail: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#D9C5B2",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(217, 197, 178, 0.7)",
    marginTop: 2,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D9C5B2",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  sectionHint: {
    fontSize: 13,
    color: "rgba(217, 197, 178, 0.6)",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tagButton: {
    backgroundColor: "rgba(217, 197, 178, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  tagButtonSelected: {
    backgroundColor: "#FF7043",
    borderColor: "#FF7043",
  },
  tagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D9C5B2",
  },
  tagTextSelected: {
    color: "#FFFFFF",
  },
  descriptionContainer: {
    backgroundColor: "#D9C5B2",
    borderRadius: 16,
    padding: 16,
  },
  descriptionInput: {
    fontSize: 15,
    color: "#1B2B21",
    lineHeight: 22,
    minHeight: 160,
    fontWeight: "500",
  },
  characterCount: {
    fontSize: 12,
    color: "rgba(27, 43, 33, 0.5)",
    textAlign: "right",
    marginTop: 8,
    fontWeight: "600",
  },
  characterCountValid: {
    color: "#4CAF50",
  },
  urgencyContainer: {
    flexDirection: "row",
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    backgroundColor: "rgba(217, 197, 178, 0.15)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  urgencyButtonSelected: {
    backgroundColor: "#D9C5B2",
    borderColor: "#FF7043",
  },
  urgencyButtonHigh: {
    backgroundColor: "#FF4444",
    borderColor: "#FF4444",
  },
  urgencyLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(217, 197, 178, 0.7)",
    marginTop: 8,
    letterSpacing: 0.3,
  },
  urgencyLabelSelected: {
    color: "#1B2B21",
  },
  urgencyLabelHigh: {
    color: "#FFFFFF",
  },
  urgencySublabel: {
    fontSize: 11,
    color: "rgba(217, 197, 178, 0.5)",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "600",
  },
  urgencySublabelSelected: {
    color: "rgba(27, 43, 33, 0.6)",
  },
  urgencySublabelHigh: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  priceCard: {
    backgroundColor: "#D9C5B2",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  priceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B2B21",
    letterSpacing: 0.3,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  priceRowLeft: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(27, 43, 33, 0.8)",
  },
  priceSubtext: {
    fontSize: 12,
    color: "rgba(27, 43, 33, 0.5)",
    marginTop: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B2B21",
  },
  priceValueHighlight: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FF7043",
  },
  priceDivider: {
    height: 1,
    backgroundColor: "rgba(27, 43, 33, 0.15)",
    marginVertical: 12,
  },
  securedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 112, 67, 0.1)",
    borderRadius: 12,
  },
  securedText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FF7043",
    letterSpacing: 0.2,
  },
  urgencyNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 68, 68, 0.15)",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
    marginBottom: 16,
  },
  urgencyNoticeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#FF4444",
    lineHeight: 20,
  },
  ctaContainer: {
    backgroundColor: "#1B2B21",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(217, 197, 178, 0.1)",
  },
  ctaButton: {
    backgroundColor: "#FF7043",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
  },
  ctaButtonDisabled: {
    backgroundColor: "rgba(255, 112, 67, 0.3)",
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  ctaHint: {
    fontSize: 12,
    color: "rgba(217, 197, 178, 0.6)",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 16,
  },
});
