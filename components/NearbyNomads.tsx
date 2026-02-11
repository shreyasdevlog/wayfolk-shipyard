import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ModeType } from "./ModeSwitcher";

interface NomadData {
  id: string;
  name: string;
  vanType: string;
  vouches: number;
  distance: string;
  status: string;
}

const NOMADS_DATA: Record<ModeType, NomadData[]> = {
  roamantic: [
    {
      id: "1",
      name: "Sierra Blackwood",
      vanType: "144 Sprinter",
      vouches: 12,
      distance: "2.3 mi",
      status: "Parked nearby",
    },
    {
      id: "2",
      name: "Mika Torres",
      vanType: "ProMaster 159",
      vouches: 8,
      distance: "4.1 mi",
      status: "On the move",
    },
    {
      id: "3",
      name: "River Ashton",
      vanType: "Ford Transit",
      vouches: 21,
      distance: "5.7 mi",
      status: "Camp setup",
    },
    {
      id: "4",
      name: "Jade Calloway",
      vanType: "Skoolie",
      vouches: 15,
      distance: "8.2 mi",
      status: "Exploring",
    },
  ],
  routemate: [
    {
      id: "5",
      name: "Kai Nakamura",
      vanType: "170 Sprinter",
      vouches: 34,
      distance: "1.1 mi",
      status: "Coffee time",
    },
    {
      id: "6",
      name: "Luna Reeves",
      vanType: "VW California",
      vouches: 19,
      distance: "3.4 mi",
      status: "Hiking trail",
    },
    {
      id: "7",
      name: "Finn McAllister",
      vanType: "Ram ProMaster",
      vouches: 27,
      distance: "6.0 mi",
      status: "Camp cooking",
    },
    {
      id: "8",
      name: "Wren Solano",
      vanType: "Transit 250",
      vouches: 11,
      distance: "9.5 mi",
      status: "Sunbathing",
    },
  ],
  builders: [
    {
      id: "9",
      name: "Bear Kowalski",
      vanType: "170 Ext Sprinter",
      vouches: 42,
      distance: "0.8 mi",
      status: "Workshop open",
    },
    {
      id: "10",
      name: "Sage Delacroix",
      vanType: "E-350 Cutaway",
      vouches: 31,
      distance: "2.6 mi",
      status: "Installing solar",
    },
    {
      id: "11",
      name: "Atlas Chen",
      vanType: "Skoolie Build",
      vouches: 56,
      distance: "5.3 mi",
      status: "Mentoring builds",
    },
    {
      id: "12",
      name: "Oakley Dunn",
      vanType: "Box Truck",
      vouches: 18,
      distance: "7.9 mi",
      status: "Welding",
    },
  ],
};

function NomadCard({ item }: { item: NomadData }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Text>
        </View>
      </View>
      <View style={styles.cardCenter}>
        <Text style={styles.nomadName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.detailRow}>
          <Ionicons name="car-outline" size={13} color="#1B2B21" />
          <Text style={styles.vanType}>{item.vanType}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="shield-checkmark" size={13} color="#FF7043" />
          <Text style={styles.vouches}>{item.vouches} Vouches</Text>
          <View style={styles.dot} />
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <TouchableOpacity style={styles.viewProfileBtn} activeOpacity={0.7}>
          <Text style={styles.viewProfileText}>View</Text>
          <Ionicons name="chevron-forward" size={14} color="#1B2B21" />
        </TouchableOpacity>
        <Text style={styles.status} numberOfLines={1}>
          {item.status}
        </Text>
      </View>
    </View>
  );
}

interface NearbyNomadsProps {
  activeMode: ModeType;
}

export default function NearbyNomads({ activeMode }: NearbyNomadsProps) {
  const nomads = NOMADS_DATA[activeMode];

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Nomads</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      {nomads.map((nomad) => (
        <NomadCard key={nomad.id} item={nomad} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9C5B2",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLeft: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1B2B21",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#D9C5B2",
    fontSize: 16,
    fontWeight: "700",
  },
  cardCenter: {
    flex: 1,
  },
  nomadName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B2B21",
    marginBottom: 3,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  vanType: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2F4A3A",
    marginLeft: 5,
  },
  vouches: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF7043",
    marginLeft: 5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#2F4A3A",
    marginHorizontal: 6,
  },
  distance: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2F4A3A",
  },
  cardRight: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  viewProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(27, 43, 33, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 6,
  },
  viewProfileText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1B2B21",
    marginRight: 2,
  },
  status: {
    fontSize: 10,
    fontWeight: "500",
    color: "#2F4A3A",
    opacity: 0.7,
  },
});
