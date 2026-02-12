import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GlobalHeader from "@/components/GlobalHeader";
import ModeSwitcher, { type ModeType } from "@/components/ModeSwitcher";
import FeaturedMeetups from "@/components/FeaturedMeetups";
import NearbyNomads from "@/components/NearbyNomads";
import CoPilotView from "@/components/CoPilotView";
import SupportView from "@/components/SupportView";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [activeMode, setActiveMode] = useState<ModeType>("convoy");

  const renderContent = () => {
    switch (activeMode) {
      case "copilot":
        return <CoPilotView />;
      case "support":
        return <SupportView />;
      case "convoy":
      default:
        return (
          <View style={styles.convoyContainer}>
            <FeaturedMeetups activeMode={activeMode} />
            <NearbyNomads activeMode={activeMode} />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GlobalHeader includeSafeArea={false} />
      <ModeSwitcher activeMode={activeMode} onModeChange={setActiveMode} />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B2B21",
  },
  convoyContainer: {
    flex: 1,
  },
});
