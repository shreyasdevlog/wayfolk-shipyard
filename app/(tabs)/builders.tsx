import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useImageGeneration } from "@fastshot/ai";
import { useRouter } from "expo-router";
import ModeSwitcher from "@/components/ModeSwitcher";
import GlobalHeader from "@/components/GlobalHeader";

interface Builder {
  id: number;
  name: string;
  specialties: string[];
  hourlyRate: number;
  consultationFee: number;
  distance: number;
  vibeRating: number;
  successfulFixes: number;
  availableForEmergency: boolean;
  imagePrompt: string;
  imageUrl?: string;
}

const INITIAL_BUILDERS: Builder[] = [
  {
    id: 1,
    name: "Jake Thompson",
    specialties: ["⚡️ Electrical", "☀️ Solar"],
    hourlyRate: 75,
    consultationFee: 50,
    distance: 2.3,
    vibeRating: 4.9,
    successfulFixes: 127,
    availableForEmergency: true,
    imagePrompt: "Portrait of an experienced electrician in a professional workshop with solar panels and electrical equipment in the background, wearing work clothes, confident and friendly expression, professional photography, workshop lighting",
  },
  {
    id: 2,
    name: "Maria Santos",
    specialties: ["💧 Plumbing", "🔧 General Repairs"],
    hourlyRate: 65,
    consultationFee: 40,
    distance: 5.8,
    vibeRating: 4.8,
    successfulFixes: 89,
    availableForEmergency: true,
    imagePrompt: "Portrait of a skilled female plumber in a clean workshop with plumbing tools and pipes visible, wearing professional work attire, warm smile, professional photography, natural workshop lighting",
  },
  {
    id: 3,
    name: "Ryan Cooper",
    specialties: ["🛠️ Carpentry", "🏗️ Structural"],
    hourlyRate: 80,
    consultationFee: 60,
    distance: 8.2,
    vibeRating: 5.0,
    successfulFixes: 156,
    availableForEmergency: false,
    imagePrompt: "Portrait of a master carpenter in a woodworking shop with tools and lumber in background, wearing carpenter apron, experienced craftsman, professional photography, warm workshop lighting",
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    specialties: ["🔥 Diesel Heater", "❄️ HVAC"],
    hourlyRate: 90,
    consultationFee: 70,
    distance: 12.1,
    vibeRating: 4.9,
    successfulFixes: 94,
    availableForEmergency: true,
    imagePrompt: "Portrait of an HVAC specialist female technician in a professional workshop with heating equipment and tools, wearing technical work clothes, expert demeanor, professional photography, bright workshop lighting",
  },
  {
    id: 5,
    name: "Marcus Lee",
    specialties: ["🔧 Mechanical", "🚐 Van Systems"],
    hourlyRate: 70,
    consultationFee: 50,
    distance: 3.7,
    vibeRating: 4.7,
    successfulFixes: 112,
    availableForEmergency: true,
    imagePrompt: "Portrait of a skilled mechanic in a garage workshop with van parts and mechanical tools, wearing mechanic coveralls, friendly and approachable, professional photography, garage lighting",
  },
  {
    id: 6,
    name: "Sophie Chen",
    specialties: ["⚡️ Electrical", "💻 Tech Systems"],
    hourlyRate: 85,
    consultationFee: 65,
    distance: 15.4,
    vibeRating: 4.8,
    successfulFixes: 78,
    availableForEmergency: false,
    imagePrompt: "Portrait of a tech-savvy electrical engineer in a modern workshop with electronic equipment and circuit boards, wearing smart casual work attire, intelligent and focused, professional photography, modern lighting",
  },
];

export default function BuildersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [builders, setBuilders] = useState<Builder[]>(INITIAL_BUILDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [sosMode, setSosMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const { generateImage } = useImageGeneration();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Pulse animation for SOS button
  useEffect(() => {
    if (sosMode) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [sosMode, pulseAnim]);

  const generateBuilderImages = useCallback(async () => {
    setIsGenerating(true);
    const updatedBuilders = [...INITIAL_BUILDERS];

    for (let i = 0; i < updatedBuilders.length; i++) {
      try {
        const result = await generateImage({
          prompt: updatedBuilders[i].imagePrompt,
          width: 512,
          height: 512,
        });

        if (result?.images && result.images.length > 0) {
          updatedBuilders[i].imageUrl = result.images[0];
        }
      } catch (error) {
        console.error(`Failed to generate image for builder ${i}:`, error);
      }
    }

    setBuilders(updatedBuilders);
    setIsGenerating(false);
  }, [generateImage]);

  useEffect(() => {
    generateBuilderImages();
  }, [generateBuilderImages]);

  const filteredBuilders = builders.filter((builder) => {
    const matchesSearch =
      searchQuery === "" ||
      builder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      builder.specialties.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSOS = !sosMode || builder.availableForEmergency;

    return matchesSearch && matchesSOS;
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`star-${i}`} name="star" size={14} color="#FFB800" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons
          key="star-half"
          name="star-half"
          size={14}
          color="#FFB800"
        />
      );
    }
    return stars;
  };

  if (isGenerating) {
    return (
      <View style={styles.container}>
        <GlobalHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7043" />
          <Text style={styles.loadingText}>
            Finding expert builders nearby...{"\n"}This may take 20-30 seconds
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
      >
        <View style={styles.headerSection}>
          <GlobalHeader includeSafeArea={false} />
          <ModeSwitcher activeMode="support" onModeChange={() => {}} />
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Expert Help Nearby</Text>
          <Text style={styles.heroSubtitle}>
            Connect with skilled builders who understand van life
          </Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#D9C5B2"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="What's broken? (Solar, Diesel Heater, Plumbing...)"
              placeholderTextColor="rgba(217, 197, 178, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#D9C5B2" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Animated.View
          style={[
            styles.sosSection,
            sosMode && {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.sosContent}>
            <View style={styles.sosTextContainer}>
              <View style={styles.sosHeader}>
                <Ionicons name="warning" size={20} color="#FF4444" />
                <Text style={styles.sosLabel}>Emergency SOS</Text>
              </View>
              <Text style={styles.sosSubtext}>
                I&apos;m stranded / Need help ASAP
              </Text>
            </View>
            <Switch
              value={sosMode}
              onValueChange={setSosMode}
              trackColor={{ false: "#2A3B31", true: "#FF4444" }}
              thumbColor={sosMode ? "#FFFFFF" : "#D9C5B2"}
              ios_backgroundColor="#2A3B31"
            />
          </View>
        </Animated.View>

        {sosMode && (
          <View style={styles.sosNotice}>
            <Text style={styles.sosNoticeText}>
              🚨 Showing {filteredBuilders.length} builders available for
              emergency assistance
            </Text>
          </View>
        )}

        <View style={styles.buildersSection}>
          <Text style={styles.sectionTitle}>
            {sosMode ? "Emergency Available" : "Available Builders"}
          </Text>
          {filteredBuilders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="construct-outline" size={48} color="#D9C5B2" />
              <Text style={styles.emptyText}>No builders found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            filteredBuilders.map((builder) => (
              <View key={builder.id} style={styles.builderCard}>
                <View style={styles.builderHeader}>
                  <View style={styles.builderImageContainer}>
                    {builder.imageUrl ? (
                      <Image
                        source={{ uri: builder.imageUrl }}
                        style={styles.builderImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[styles.builderImage, styles.placeholderImage]}
                      >
                        <Ionicons
                          name="person"
                          size={32}
                          color="#1B2B21"
                        />
                      </View>
                    )}
                    {builder.availableForEmergency && (
                      <View style={styles.emergencyBadge}>
                        <Ionicons name="flash" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <View style={styles.builderInfo}>
                    <Text style={styles.builderName}>{builder.name}</Text>
                    <View style={styles.ratingContainer}>
                      {renderStars(builder.vibeRating)}
                      <Text style={styles.ratingText}>
                        {builder.vibeRating.toFixed(1)}
                      </Text>
                    </View>
                    <Text style={styles.successText}>
                      {builder.successfulFixes} Successful Fixes
                    </Text>
                  </View>
                </View>

                <View style={styles.specialtiesContainer}>
                  {builder.specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyBadge}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.builderDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="location" size={16} color="#FF7043" />
                      <Text style={styles.detailText}>
                        {builder.distance.toFixed(1)} mi away
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="cash" size={16} color="#FF7043" />
                      <Text style={styles.detailText}>
                        ${builder.consultationFee} / Consultation
                      </Text>
                    </View>
                  </View>
                  <View style={styles.hourlyRateContainer}>
                    <Text style={styles.hourlyRateLabel}>Hourly Rate:</Text>
                    <Text style={styles.hourlyRateValue}>
                      ${builder.hourlyRate}/hr
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.requestButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    router.push({
                      pathname: "/work-request",
                      params: {
                        name: builder.name,
                        imageUrl: builder.imageUrl || "",
                        hourlyRate: builder.hourlyRate.toString(),
                        consultationFee: builder.consultationFee.toString(),
                      },
                    });
                  }}
                >
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                  <Text style={styles.requestButtonText}>Request Help</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>How it works</Text>
          <View style={styles.footerSteps}>
            <View style={styles.footerStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Browse builders by specialty and location
              </Text>
            </View>
            <View style={styles.footerStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Book a 15-min video call or local visit
              </Text>
            </View>
            <View style={styles.footerStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Payments handled securely via Wayfolk
              </Text>
            </View>
          </View>
          <View style={styles.footerNote}>
            <Ionicons name="shield-checkmark" size={20} color="#FF7043" />
            <Text style={styles.footerNoteText}>
              All builders are verified and insured
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#D9C5B2",
    textAlign: "center",
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    backgroundColor: "#1B2B21",
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#D9C5B2",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(217, 197, 178, 0.7)",
    lineHeight: 22,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#253A2E",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  searchIcon: {
    opacity: 0.8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#D9C5B2",
    fontWeight: "500",
  },
  sosSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#2A3B31",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FF4444",
    padding: 16,
  },
  sosContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sosTextContainer: {
    flex: 1,
  },
  sosHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sosLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF4444",
    letterSpacing: 0.3,
  },
  sosSubtext: {
    fontSize: 13,
    color: "rgba(217, 197, 178, 0.8)",
    marginTop: 2,
  },
  sosNotice: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "rgba(255, 68, 68, 0.15)",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
  },
  sosNoticeText: {
    fontSize: 14,
    color: "#FF4444",
    fontWeight: "600",
  },
  buildersSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#D9C5B2",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#D9C5B2",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(217, 197, 178, 0.6)",
    marginTop: 8,
  },
  builderCard: {
    backgroundColor: "#D9C5B2",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  builderHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  builderImageContainer: {
    position: "relative",
  },
  builderImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E5D4C1",
  },
  placeholderImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  builderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  builderName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B2B21",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B2B21",
    marginLeft: 4,
  },
  successText: {
    fontSize: 13,
    color: "rgba(27, 43, 33, 0.7)",
    fontWeight: "500",
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  specialtyBadge: {
    backgroundColor: "#FF7043",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  builderDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1B2B21",
    flex: 1,
  },
  hourlyRateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(27, 43, 33, 0.08)",
    padding: 10,
    borderRadius: 8,
  },
  hourlyRateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(27, 43, 33, 0.7)",
  },
  hourlyRateValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B2B21",
  },
  requestButton: {
    backgroundColor: "#FF7043",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  footerSection: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: "#253A2E",
    borderRadius: 16,
    padding: 20,
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF7043",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  footerSteps: {
    gap: 16,
    marginBottom: 20,
  },
  footerStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF7043",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#D9C5B2",
    paddingTop: 2,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 112, 67, 0.1)",
    padding: 12,
    borderRadius: 12,
  },
  footerNoteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D9C5B2",
    flex: 1,
  },
});
