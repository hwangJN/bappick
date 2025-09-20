import Constants from "expo-constants";
import { Platform } from "react-native";

export type ClientVersion = {
  version: string; // semver
  build: number; // platform build number
  platform: "ios" | "android" | "web" | "unknown";
};

export function compareSemver(a: string, b: string): number {
  const ap = a.split(".").map((n) => parseInt(n, 10) || 0);
  const bp = b.split(".").map((n) => parseInt(n, 10) || 0);
  const len = Math.max(ap.length, bp.length);
  for (let i = 0; i < len; i++) {
    const ai = ap[i] ?? 0;
    const bi = bp[i] ?? 0;
    if (ai > bi) return 1;
    if (ai < bi) return -1;
  }
  return 0;
}

export function getClientVersion(): ClientVersion {
  const version = Constants.expoConfig?.version ?? "0.0.0";
  let build = 1;
  if (Platform.OS === "ios") {
    const raw = (Constants.expoConfig as any)?.ios?.buildNumber;
    const parsed = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
    build = Number.isFinite(parsed) ? parsed : 1;
  } else if (Platform.OS === "android") {
    const raw = (Constants.expoConfig as any)?.android?.versionCode;
    const parsed = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
    build = Number.isFinite(parsed) ? parsed : 1;
  }
  const platform =
    Platform.OS === "ios" || Platform.OS === "android"
      ? Platform.OS
      : Platform.OS === "web"
      ? "web"
      : "unknown";
  return { version, build, platform };
}
