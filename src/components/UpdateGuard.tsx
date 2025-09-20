import {
  fetchUpdateManifest,
  type PlatformConfig,
} from "@/src/lib/updateManifest";
import { compareSemver, getClientVersion } from "@/src/lib/version";
import { ClayColors, ClayShadow } from "@/src/styles/clay";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  manifestUrl: string;
  children: React.ReactNode;
};

type GuardState =
  | { kind: "ok" }
  | { kind: "soft"; storeUrl?: string }
  | { kind: "hard"; storeUrl?: string }
  | { kind: "kill" };

function evalPlatform(config?: PlatformConfig): GuardState {
  if (!config) return { kind: "ok" };
  if (config.kill_switch) return { kind: "kill" };

  const client = getClientVersion();
  const byVersion = compareSemver(client.version, config.min_supported_version);
  if (byVersion < 0) return { kind: "hard", storeUrl: config.store_url };

  if (
    typeof config.min_supported_build === "number" &&
    client.build < config.min_supported_build
  ) {
    return { kind: "hard", storeUrl: config.store_url };
  }

  // soft: below recommended
  const softByVersion = compareSemver(
    client.version,
    config.recommended_version
  );
  if (softByVersion < 0) return { kind: "soft", storeUrl: config.store_url };
  if (
    typeof config.recommended_build === "number" &&
    client.build < config.recommended_build
  ) {
    return { kind: "soft", storeUrl: config.store_url };
  }
  return { kind: "ok" };
}

export default function UpdateGuard({ manifestUrl, children }: Props) {
  const [state, setState] = React.useState<GuardState>({ kind: "ok" });
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const m = await fetchUpdateManifest(manifestUrl, 6000);
        const platformKey =
          Platform.OS === "ios"
            ? "ios"
            : Platform.OS === "android"
            ? "android"
            : undefined;
        const conf = platformKey
          ? ((m as any)[platformKey] as PlatformConfig)
          : undefined;
        const next = evalPlatform(conf);
        if (!cancelled) setState(next);
      } catch (e) {
        // 네트워크 오류 시 가드 미적용 (정상 사용 허용)
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [manifestUrl]);

  if (!loaded) return <>{children}</>;

  if (state.kind === "kill") {
    return (
      <View style={[styles.fill]}>
        <LinearGradient
          colors={[ClayColors.bgFrom, ClayColors.bgTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.center, styles.card, ClayShadow.outer]}>
          <Text style={styles.title}>점검 중</Text>
          <Text style={styles.body}>현재 서비스가 점검중입니다</Text>
          <Text style={styles.body}>잠시 후 다시 시도해주세요.</Text>
        </View>
      </View>
    );
  }
  //state.kind === "hard"
  if (state.kind === "hard") {
    return (
      <View style={styles.fill}>
        <LinearGradient
          colors={[ClayColors.bgFrom, ClayColors.bgTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.center, styles.card, ClayShadow.outer]}>
          <Text style={styles.title}>업데이트 필요</Text>
          <Text style={styles.body}>
            계속 사용하려면 최신 버전으로 업데이트해주세요.
          </Text>
          {state.storeUrl ? (
            <Pressable
              style={[styles.primaryBtn, ClayShadow.outer]}
              onPress={() => Linking.openURL(state.storeUrl!)}
            >
              <Text style={styles.primaryBtnLabel}>스토어로 이동</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <>
      {/* {state.kind === "soft" ? (
          <View style={styles.bannerWrap}>
            <View style={[styles.banner, ClayShadow.outer]}>
              <Text style={styles.bannerText}>
                새 버전이 있어요. 업데이트를 권장합니다.
              </Text>
              {state.storeUrl ? (
                <Pressable onPress={() => Linking.openURL(state.storeUrl!)}>
                  <Text style={styles.bannerLink}>업데이트</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null} */}
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: "center", gap: 12 },
  card: {
    marginHorizontal: 20,
    marginTop: 120,
    backgroundColor: ClayColors.cardFrom,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: ClayColors.border,
  },
  title: { fontSize: 20, fontWeight: "800", color: ClayColors.text },
  body: { fontSize: 14, color: ClayColors.text, textAlign: "center" },
  primaryBtn: {
    backgroundColor: ClayColors.primaryFrom,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnLabel: { color: ClayColors.primaryText, fontWeight: "800" },
  bannerWrap: {
    position: "absolute",
    top: 8,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  banner: {
    backgroundColor: "#F0F6FF",
    borderColor: ClayColors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bannerText: { color: ClayColors.text },
  bannerLink: { color: "#2b6cff", fontWeight: "700" },
});
