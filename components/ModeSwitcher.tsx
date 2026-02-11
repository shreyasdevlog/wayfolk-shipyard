import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  type LayoutChangeEvent,
} from "react-native";

export type ModeType = "roamantic" | "routemate" | "builders";

interface ModeSwitcherProps {
  activeMode: ModeType;
  onModeChange: (mode: ModeType) => void;
}

const MODES: { key: ModeType; label: string; subtitle: string }[] = [
  { key: "roamantic", label: "Roamantic", subtitle: "Dating" },
  { key: "routemate", label: "RouteMate", subtitle: "Friends" },
  { key: "builders", label: "Builders", subtitle: "Help" },
];

const PADDING = 4;

export default function ModeSwitcher({
  activeMode,
  onModeChange,
}: ModeSwitcherProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  const activeIndex = MODES.findIndex((m) => m.key === activeMode);

  useEffect(() => {
    if (indicatorWidth > 0) {
      Animated.spring(slideAnim, {
        toValue: activeIndex * indicatorWidth,
        useNativeDriver: true,
        tension: 68,
        friction: 12,
      }).start();
    }
  }, [activeIndex, indicatorWidth, slideAnim]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const containerW = e.nativeEvent.layout.width;
    const tabW = (containerW - PADDING * 2) / 3;
    setIndicatorWidth(tabW);
    slideAnim.setValue(activeIndex * tabW);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container} onLayout={handleLayout}>
        {indicatorWidth > 0 && (
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                width: indicatorWidth,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          />
        )}
        {MODES.map((mode) => {
          const isActive = activeMode === mode.key;
          return (
            <TouchableOpacity
              key={mode.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => onModeChange(mode.key)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {mode.label}
              </Text>
              <Text
                style={[
                  styles.tabSubtitle,
                  isActive
                    ? styles.tabSubtitleActive
                    : styles.tabSubtitleInactive,
                ]}
              >
                {mode.subtitle}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#253A2E",
    borderRadius: 16,
    padding: PADDING,
    position: "relative",
    overflow: "hidden",
  },
  activeIndicator: {
    position: "absolute",
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    backgroundColor: "#FF7043",
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },
  tabLabelInactive: {
    color: "#D9C5B2",
  },
  tabSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },
  tabSubtitleActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  tabSubtitleInactive: {
    color: "rgba(217, 197, 178, 0.6)",
  },
});
