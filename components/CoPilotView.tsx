import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useImageGeneration } from "@fastshot/ai";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface NomadProfile {
    id: number;
    name: string;
    age: number;
    location: string;
    rigType: string;
    trajectory: string;
    vibe: string;
    imagePrompt: string;
    imageUrl?: string;
}

const INITIAL_PROFILES: NomadProfile[] = [
    {
        id: 1,
        name: "Luna",
        age: 28,
        location: "Joshua Tree, CA",
        rigType: "🚌 School Bus",
        trajectory: "Heading North",
        vibe: "Desert dreamer seeking sunrise adventures. Love rock climbing, stargazing, and cooking over campfires. Looking for someone who values freedom and deep conversations under the stars.",
        imagePrompt: "Portrait of a young woman with adventure spirit, standing near a vintage school bus in Joshua Tree desert, golden hour lighting, cinematic photography",
    },
    {
        id: 2,
        name: "River",
        age: 32,
        location: "Olympic National Park, WA",
        rigType: "🚐 Sprinter Van",
        trajectory: "Westbound on I-90",
        vibe: "Pacific Northwest soul chasing misty mountains and coastal waves. Photographer by day, guitar player by firelight. Let's explore hidden trails and share stories.",
        imagePrompt: "Portrait of a bearded man with friendly smile near a white sprinter van, lush green forest background, moody natural lighting, adventure photographer aesthetic",
    },
    {
        id: 3,
        name: "Sky",
        age: 26,
        location: "Moab, UT",
        rigType: "🏕️ Rooftop Tent",
        trajectory: "Exploring Southwest",
        vibe: "Rock climbing nomad living for the next adventure. Minimalist at heart, maximalist in experiences. Seeking a partner to conquer peaks and valleys together.",
        imagePrompt: "Portrait of an athletic woman with climbing gear, red rock formations background, adventure lifestyle, warm sunset tones, outdoor portrait",
    },
    {
        id: 4,
        name: "Atlas",
        age: 30,
        location: "Big Sur, CA",
        rigType: "🚐 VW Westfalia",
        trajectory: "Heading South on Highway 1",
        vibe: "Vintage van life enthusiast and coastal wanderer. Sunrise surfer, sunset painter. Looking for someone who appreciates slow living and the simple beauty of the road.",
        imagePrompt: "Portrait of a man with surfboard next to vintage VW van, ocean coastal scenery, golden hour, retro California vibes, lifestyle photography",
    },
    {
        id: 5,
        name: "Sage",
        age: 29,
        location: "Sedona, AZ",
        rigType: "🏠 Tiny Home on Wheels",
        trajectory: "Southwest Circuit",
        vibe: "Yoga teacher and herbal tea enthusiast finding peace in red rock country. I believe in mindful living and authentic connections. Let's flow together on this journey.",
        imagePrompt: "Portrait of a serene woman doing yoga pose near a small modern tiny house, red rock Sedona background, peaceful atmosphere, natural warm lighting",
    },
];

export default function CoPilotView() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [profiles, setProfiles] = useState<NomadProfile[]>(INITIAL_PROFILES);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(true);
    const { generateImage } = useImageGeneration();

    const generateProfileImages = useCallback(async () => {
        setIsGenerating(true);
        const updatedProfiles = [...INITIAL_PROFILES];

        for (let i = 0; i < updatedProfiles.length; i++) {
            try {
                const result = await generateImage({
                    prompt: updatedProfiles[i].imagePrompt,
                    width: 1024,
                    height: 1024,
                });

                if (result?.images && result.images.length > 0) {
                    updatedProfiles[i].imageUrl = result.images[0];
                }
            } catch (error) {
                console.error(`Failed to generate image for profile ${i}:`, error);
            }
        }

        setProfiles(updatedProfiles);
        setIsGenerating(false);
    }, [generateImage]);

    useEffect(() => {
        generateProfileImages();
    }, [generateProfileImages]);

    const handlePass = () => {
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const handleLike = () => {
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const handleMessage = () => {
        router.push("/(tabs)/messages");
    };

    const currentProfile = profiles[currentIndex];

    if (isGenerating) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF7043" />
                <Text style={styles.loadingText}>
                    Generating nomad profiles...{"\n"}This may take 20-30 seconds
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    {currentProfile.imageUrl ? (
                        <Image
                            source={{ uri: currentProfile.imageUrl }}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.profileImage, styles.placeholderImage]}>
                            <Ionicons name="person" size={80} color="#D9C5B2" />
                        </View>
                    )}
                    <LinearGradient
                        colors={["transparent", "rgba(27, 43, 33, 0.9)"]}
                        style={styles.gradient}
                    >
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>
                                {currentProfile.name}, {currentProfile.age}
                            </Text>
                            <View style={styles.locationBadge}>
                                <Ionicons name="location" size={14} color="#FF7043" />
                                <Text style={styles.locationText}>
                                    Currently in: {currentProfile.location}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.statsBar}>
                    <View style={styles.statBadge}>
                        <Text style={styles.statText}>{currentProfile.rigType}</Text>
                    </View>
                    <View style={styles.statBadge}>
                        <Ionicons name="navigate" size={14} color="#FF7043" />
                        <Text style={styles.statText}>{currentProfile.trajectory}</Text>
                    </View>
                </View>

                <View style={styles.bioSection}>
                    <Text style={styles.bioTitle}>Vibe Check</Text>
                    <Text style={styles.bioText}>{currentProfile.vibe}</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.passButton]}
                    onPress={handlePass}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={32} color="#D9C5B2" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.messageButton]}
                    onPress={handleMessage}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chatbubble" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.likeButton]}
                    onPress={handleLike}
                    activeOpacity={0.7}
                >
                    <Ionicons name="heart" size={32} color="#FF7043" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
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
        padding: 20,
        paddingBottom: 140,
    },
    cardContainer: {
        width: "100%",
    },
    card: {
        width: "100%",
        height: width * 1.3,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#2A3B31",
    },
    profileImage: {
        width: "100%",
        height: "100%",
    },
    placeholderImage: {
        backgroundColor: "#2A3B31",
        alignItems: "center",
        justifyContent: "center",
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        justifyContent: "flex-end",
        padding: 20,
    },
    profileInfo: {
        gap: 8,
    },
    profileName: {
        fontSize: 32,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
    locationBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(27, 43, 33, 0.8)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        alignSelf: "flex-start",
    },
    locationText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#D9C5B2",
    },
    statsBar: {
        flexDirection: "row",
        gap: 12,
        marginTop: 16,
    },
    statBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2A3B31",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 16,
        gap: 6,
    },
    statText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#D9C5B2",
    },
    bioSection: {
        marginTop: 20,
        backgroundColor: "#2A3B31",
        padding: 20,
        borderRadius: 16,
    },
    bioTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FF7043",
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    bioText: {
        fontSize: 15,
        lineHeight: 24,
        color: "#D9C5B2",
        letterSpacing: 0.3,
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        marginTop: 30,
        paddingBottom: 20,
    },
    actionButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    passButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D9C5B2",
    },
    messageButton: {
        backgroundColor: "#FF7043",
        width: 72,
        height: 72,
        borderRadius: 36,
    },
    likeButton: {
        backgroundColor: "#D9C5B2",
    },
});
