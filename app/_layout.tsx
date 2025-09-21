import OtaUpdateModal from "@/src/components/OtaUpdateModal";
import UpdateGuard from "@/src/components/UpdateGuard";
import { fetchAndApplyAsync, onFetchUpdateAsync } from "@/src/lib/ota";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Updates from "expo-updates";

export const unstable_settings = {
  anchor: "(tabs)",
};

// Keep the splash screen visible while we load resources

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showCustomSplash, setShowCustomSplash] = React.useState(true);
  const [otaVisible, setOtaVisible] = React.useState(false);

  // React.useEffect(() => {
  //   SplashScreen.preventAutoHideAsync();
  //   const t = setTimeout(() => {
  //     SplashScreen.hideAsync().catch(() => {});
  //     setShowCustomSplash(false);
  //   }, 1000);
  //   return () => clearTimeout(t);
  // }, []);

  React.useEffect(() => {
    (async () => {
      const res = await onFetchUpdateAsync();
      if (res.type === "available") {
        setOtaVisible(true);
      }
    })();
  }, []);

  console.log("channel", Updates.channel); // 빌드가 바라보는 채널
  console.log("runtime", Updates.runtimeVersion); // 빌드의 runtimeVersion

  // if (showCustomSplash) {
  //   return <CustomSplash visible={showCustomSplash} />;
  // }

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
          <StatusBar style="auto" />
        </UpdateGuard>
        <OtaUpdateModal
          visible={otaVisible}
          onCancel={() => setOtaVisible(false)}
          onUpdate={async () => {
            setOtaVisible(false);
            await fetchAndApplyAsync();
          }}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
