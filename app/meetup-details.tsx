import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ActivityVibe {
    id: string;
    time: string;
    title: string;
    description: string;
}

const PLANNED_VIBES: ActivityVibe[] = [
    {
        id: "1",
        time: "08:00 AM",
        title: "Sunrise Yoga",
        description: "Start the day with a mindful flow overlooking the canyon.",
    },
    {
        id: "2",
        time: "11:00 AM",
        title: "Gear Swap & Coffee",
        description: "Exchange van life hacks and spare parts over local brews.",
    },
    {
        id: "3",
        time: "02:00 PM",
        title: "Trail Run / Group Hike",
        description: "Exploring the hidden arches of the back-country.",
    },
    {
        id: "4",
        time: "06:30 PM",
        title: "Sunset Cook-off",
        description: "Community dinner under the stars. Bring your best rig-made dish.",
    },
];

export default function MeetupDetailsScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { title, date, location, image, attendees } = params;

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
            >
                {/* Header Hero */}
                <View style={styles.heroContainer}>
                    <Image
                        source={image ? Number(image) : null}
                        style={styles.heroImage}
                        contentFit="cover"
                    />
                    <LinearGradient
                        colors={["rgba(27, 43, 33, 0.4)", "transparent", "rgba(27, 43, 33, 0.8)"]}
                        style={styles.heroOverlay}
                    />
                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 10 }]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.detailsBlock}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={16} color="#FF7043" />
                            <Text style={styles.infoText}>{date}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={16} color="#FF7043" />
                            <Text style={styles.infoText}>{location}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.navigateButton} activeOpacity={0.8}>
                        <Ionicons name="map" size={18} color="#FFFFFF" />
                        <Text style={styles.navigateButtonText}>Navigate to Meetup</Text>
                    </TouchableOpacity>

                    {/* Who's Going */}
                    <View style={styles.whoSection}>
                        <Text style={styles.sectionLabel}>Who&apos;s Going</Text>
                        <View style={styles.avatarRow}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <View key={i} style={[styles.avatar, { marginLeft: i === 1 ? 0 : -12 }]}>
                                    <Image
                                        source={{ uri: `https://i.pravatar.cc/100?u=${i}` }}
                                        style={styles.avatarImg}
                                    />
                                </View>
                            ))}
                            <View style={styles.attendeeCount}>
                                <Text style={styles.attendeeText}>
                                    {attendees} Nomads joined
                                </Text>
                                <Text style={styles.plusMore}>+8 more</Text>
                            </View>
                        </View>
                    </View>

                    {/* Itinerary */}
                    <View style={styles.itinerarySection}>
                        <Text style={styles.sectionLabel}>Planned Vibes</Text>
                        {PLANNED_VIBES.map((vibe, index) => (
                            <View key={vibe.id} style={styles.itineraryItem}>
                                <View style={styles.timeline}>
                                    <View style={styles.dot} />
                                    {index !== PLANNED_VIBES.length - 1 && <View style={styles.line} />}
                                </View>
                                <View style={styles.vibeContent}>
                                    <Text style={styles.vibeTime}>{vibe.time}</Text>
                                    <Text style={styles.vibeTitle}>{vibe.title}</Text>
                                    <Text style={styles.vibeDesc}>{vibe.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Primary CTA */}
            <View style={[styles.bottomCTA, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <TouchableOpacity style={styles.rsvpButton} activeOpacity={0.9}>
                    <Text style={styles.rsvpButtonText}>Drop an Anchor</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1B2B21",
    },
    heroContainer: {
        width: "100%",
        height: 320,
        backgroundColor: "#253A2E",
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: "absolute",
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(27, 43, 33, 0.5)",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        padding: 20,
        marginTop: -40,
    },
    detailsBlock: {
        backgroundColor: "#D9C5B2",
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1B2B21",
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 10,
    },
    infoText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2F4A3A",
    },
    navigateButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2F4A3A",
        paddingVertical: 14,
        borderRadius: 12,
        gap: 10,
        marginBottom: 30,
    },
    navigateButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
    whoSection: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: "700",
        color: "#D9C5B2",
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    avatarRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: "#1B2B21",
        overflow: "hidden",
        backgroundColor: "#253A2E",
    },
    avatarImg: {
        width: "100%",
        height: "100%",
    },
    attendeeCount: {
        marginLeft: 16,
    },
    attendeeText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    plusMore: {
        fontSize: 12,
        fontWeight: "600",
        color: "#FF7043",
    },
    itinerarySection: {
        marginBottom: 20,
    },
    itineraryItem: {
        flexDirection: "row",
        gap: 16,
    },
    timeline: {
        alignItems: "center",
        width: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FF7043",
        marginTop: 6,
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: "rgba(217, 197, 178, 0.2)",
        marginVertical: 4,
    },
    vibeContent: {
        flex: 1,
        paddingBottom: 24,
    },
    vibeTime: {
        fontSize: 12,
        fontWeight: "700",
        color: "#FF7043",
        marginBottom: 4,
    },
    vibeTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#D9C5B2",
        marginBottom: 4,
    },
    vibeDesc: {
        fontSize: 14,
        fontWeight: "500",
        color: "rgba(217, 197, 178, 0.7)",
        lineHeight: 20,
    },
    bottomCTA: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        backgroundColor: "rgba(27, 43, 33, 0.95)",
        paddingTop: 16,
    },
    rsvpButton: {
        backgroundColor: "#FF7043",
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#FF7043",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    rsvpButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
});
