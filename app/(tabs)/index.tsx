import React, { useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";

import GlobalHeader from "@/components/GlobalHeader";
import ModeSwitcher, { type ModeType } from "@/components/ModeSwitcher";
import FeaturedMeetups from "@/components/FeaturedMeetups";
import NearbyNomads from "@/components/NearbyNomads";

export default function ExploreScreen() {
  const [activeMode, setActiveMode] = useState<ModeType>("copilot");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#D9C5B2"
          colors={["#FF7043"]}
        />
      }
    >
      <GlobalHeader />
      <ModeSwitcher activeMode={activeMode} onModeChange={setActiveMode} />
      <FeaturedMeetups activeMode={activeMode} />
      <NearbyNomads activeMode={activeMode} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2B21",
  },
});
