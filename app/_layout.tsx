import CustomSplash from "@/src/components/CustomSplash";
import UpdateGuard from "@/src/components/UpdateGuard";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

// Keep the splash screen visible while we load resources

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showCustomSplash, setShowCustomSplash] = React.useState(true);

  React.useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
      setShowCustomSplash(false);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  if (showCustomSplash) {
    return <CustomSplash visible={showCustomSplash} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <UpdateGuard
          manifestUrl={"https://hwangjn.github.io/bappick-json/manifest.json"}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <CustomSplash visible={showCustomSplash} />
          <StatusBar style="auto" />
        </UpdateGuard>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
