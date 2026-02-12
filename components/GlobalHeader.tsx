import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

interface GlobalHeaderProps {
  /**
   * If true, uses default top padding. If false, no padding (parent controls it)
   */
  includeSafeArea?: boolean;
}

export default function GlobalHeader({
  includeSafeArea = true,
}: GlobalHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        includeSafeArea && { paddingTop: insets.top },
      ]}
    >
      <View style={styles.inner}>
        <Text style={styles.brandName}>Wayfolk</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1B2B21",
    paddingHorizontal: 20,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D9C5B2",
    letterSpacing: 1.5,
    fontStyle: "italic",
  },
});
