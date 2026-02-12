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

export default function NomadProfileScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { name, vanType, vouches, distance, status } = params;

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            >
                {/* Header Photo */}
                <View style={styles.headerPhotoContainer}>
                    <Image
                        source={{ uri: `https://i.pravatar.cc/600?u=${name}` }}
                        style={styles.profilePhoto}
                        contentFit="cover"
                    />
                    <LinearGradient
                        colors={["rgba(27, 43, 33, 0.4)", "transparent", "rgba(27, 43, 33, 0.6)"]}
                        style={styles.photoOverlay}
                    />
                    <TouchableOpacity
                        style={[styles.backButton, { top: insets.top + 10 }]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={styles.vouchBadge}>
                        <Ionicons name="shield-checkmark" size={20} color="#FF7043" />
                        <Text style={styles.vouchCount}>{vouches}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>{name}</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>{status} • {distance} away</Text>
                    </View>

                    {/* Rig & Route Card */}
                    <View style={styles.rigCard}>
                        <View style={styles.rigHeader}>
                            <Ionicons name="bus-outline" size={24} color="#1B2B21" />
                            <Text style={styles.cardTitle}>The Rig & Route</Text>
                        </View>
                        <View style={styles.rigDetail}>
                            <Text style={styles.rigLabel}>Setup</Text>
                            <Text style={styles.rigValue}>{vanType}</Text>
                        </View>
                        <View style={styles.rigDetail}>
                            <Text style={styles.rigLabel}>Trajectory</Text>
                            <Text style={styles.rigValue}>Heading toward Moab, UT</Text>
                        </View>
                    </View>

                    {/* Bio */}
                    <View style={styles.bioSection}>
                        <Text style={styles.sectionLabel}>Vibe Check</Text>
                        <Text style={styles.bioBody}>
                            Living life on four wheels and finding beauty in the breakdown. I&apos;ve
                            been on the road for 3 years now, mostly chasing the dry heat of the
                            Southwest and the misty peaks of the PNW. My rig is a hand-built
                            labor of love, equipped with 400W of solar and enough coffee to start a small revolution.
                            {"\n\n"}
                            Always looking for fellow nomads to share a campfire, swap some
                            mechanical advice, or join a convoy to the next hidden gem.
                            Minimalist at heart, maximalist in experiences. Let&apos;s ride.
                        </Text>
                    </View>

                    {/* Interaction Hub */}
                    <View style={styles.interactionHub}>
                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                            <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                            <Text style={styles.actionButtonText}>Send a Signal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]} activeOpacity={0.8}>
                            <Ionicons name="link" size={20} color="#1B2B21" />
                            <Text style={[styles.actionButtonText, { color: "#1B2B21" }]}>Propose a Convoy</Text>
                        </TouchableOpacity>
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
    headerPhotoContainer: {
        width: "100%",
        height: 400,
    },
    profilePhoto: {
        width: "100%",
        height: "100%",
    },
    photoOverlay: {
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
    vouchBadge: {
        position: "absolute",
        bottom: -20,
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    vouchCount: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1B2B21",
    },
    content: {
        padding: 24,
        paddingTop: 40,
    },
    name: {
        fontSize: 32,
        fontWeight: "800",
        color: "#D9C5B2",
        marginBottom: 8,
        textAlign: "center",
        letterSpacing: 0.5,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#4CAF50",
    },
    statusText: {
        fontSize: 14,
        fontWeight: "600",
        color: "rgba(217, 197, 178, 0.7)",
    },
    rigCard: {
        backgroundColor: "#D9C5B2",
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
    },
    rigHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1B2B21",
        letterSpacing: 0.3,
    },
    rigDetail: {
        marginBottom: 12,
    },
    rigLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "rgba(27, 43, 33, 0.6)",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },
    rigValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1B2B21",
    },
    bioSection: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FF7043",
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    bioBody: {
        fontSize: 15,
        lineHeight: 24,
        color: "#D9C5B2",
        fontWeight: "500",
    },
    interactionHub: {
        flexDirection: "row",
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF7043",
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    secondaryAction: {
        backgroundColor: "#D9C5B2",
    },
    actionButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
});
