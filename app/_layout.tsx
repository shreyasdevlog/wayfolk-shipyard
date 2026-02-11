import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Purchases from "react-native-purchases";

export default function RootLayout() {

  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

        if (!apiKey) {
          console.warn("RevenueCat API key not found");
          return;
        }

        // Configure RevenueCat
        Purchases.configure({ apiKey });

        // Enable debug logs in development
        if (__DEV__) {
          Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        }

        // Fetch customer info immediately to verify subscription status
        await Purchases.getCustomerInfo();

        console.log("RevenueCat initialized successfully");
      } catch (error) {
        console.error("Error initializing RevenueCat:", error);
      }
    };

    initializeRevenueCat();
  }, []);

  // Don't block app rendering on RevenueCat initialization
  // It will handle the check in the background
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="work-request"
          options={{
            presentation: "card",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}
