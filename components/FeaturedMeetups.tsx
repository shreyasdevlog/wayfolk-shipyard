import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import type { ModeType } from "./ModeSwitcher";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_SPACING = 12;

interface MeetupData {
  id: string;
  title: string;
  date: string;
  location: string;
  image: number;
  attendees: number;
  badge: string;
}

const MEETUPS_DATA: Record<ModeType, MeetupData[]> = {
  copilot: [
    {
      id: "1",
      title: "Sunset Summit Social",
      date: "Feb 14 - Feb 16",
      location: "Joshua Tree, CA",
      image: require("@/assets/images/meetup1.png"),
      attendees: 24,
      badge: "Co-Pilot",
    },
    {
      id: "2",
      title: "Stargazer\u2019s Night",
      date: "Feb 21 - Feb 23",
      location: "Sedona, AZ",
      image: require("@/assets/images/meetup2.png"),
      attendees: 18,
      badge: "Co-Pilot",
    },
    {
      id: "3",
      title: "Coastal Drift Meetup",
      date: "Mar 1 - Mar 3",
      location: "Big Sur, CA",
      image: require("@/assets/images/meetup3.png"),
      attendees: 32,
      badge: "Co-Pilot",
    },
  ],
  convoy: [
    {
      id: "4",
      title: "Mountain Pass Convoy",
      date: "Feb 18 - Feb 20",
      location: "Moab, UT",
      image: require("@/assets/images/meetup3.png"),
      attendees: 45,
      badge: "Convoy",
    },
    {
      id: "5",
      title: "Desert Dawn Gathering",
      date: "Feb 25 - Feb 27",
      location: "Death Valley, CA",
      image: require("@/assets/images/meetup1.png"),
      attendees: 28,
      badge: "Convoy",
    },
    {
      id: "6",
      title: "Forest Trail Hangout",
      date: "Mar 5 - Mar 7",
      location: "Olympic NP, WA",
      image: require("@/assets/images/meetup2.png"),
      attendees: 36,
      badge: "Convoy",
    },
  ],
  support: [
    {
      id: "7",
      title: "Van Build Workshop",
      date: "Feb 22 - Feb 24",
      location: "Portland, OR",
      image: require("@/assets/images/meetup2.png"),
      attendees: 20,
      badge: "Support",
    },
    {
      id: "8",
      title: "Solar Setup Clinic",
      date: "Mar 1 - Mar 2",
      location: "Bend, OR",
      image: require("@/assets/images/meetup1.png"),
      attendees: 15,
      badge: "Support",
    },
    {
      id: "9",
      title: "Off-Grid Skills Day",
      date: "Mar 10 - Mar 12",
      location: "Flagstaff, AZ",
      image: require("@/assets/images/meetup3.png"),
      attendees: 22,
      badge: "Support",
    },
  ],
};

function MeetupCard({ item }: { item: MeetupData }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/meetup-details",
      params: {
        id: item.id,
        title: item.title,
        date: item.date,
        location: item.location,
        image: item.image,
        attendees: item.attendees.toString(),
        badge: item.badge,
      },
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <Image
        source={item.image}
        style={styles.cardImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.cardOverlay} />
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardLocation}>{item.location}</Text>
          <Text style={styles.cardAttendees}>{item.attendees} going</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface FeaturedMeetupsProps {
  activeMode: ModeType;
}

export default function FeaturedMeetups({ activeMode }: FeaturedMeetupsProps) {
  const meetups = MEETUPS_DATA[activeMode];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Meetups</Text>
      </View>
      <FlatList
        data={meetups}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        renderItem={({ item }) => <MeetupCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#D9C5B2",
    letterSpacing: 0.3,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF7043",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: 210,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#253A2E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(27, 43, 33, 0.35)",
  },
  badgeContainer: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  badge: {
    backgroundColor: "#FF7043",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: "rgba(27, 43, 33, 0.7)",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: "500",
    color: "#D9C5B2",
    marginBottom: 6,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLocation: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(217, 197, 178, 0.8)",
  },
  cardAttendees: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FF7043",
  },
});
