import * as Updates from "expo-updates";

export async function onFetchUpdateAsync(): Promise<
  | {
      type: "available";
      manifest?: Updates.Manifest;
    }
  | { type: "none" }
  | { type: "error"; error: unknown }
> {
  try {
    if (__DEV__) return { type: "none" };
    // EAS Update가 활성화된 환경에서만 동작
    if (!Updates.isEnabled) return { type: "none" };
    const result = await Updates.checkForUpdateAsync();
    if (result.isAvailable) {
      return { type: "available", manifest: result.manifest };
    }
    return { type: "none" };
  } catch (error) {
    return { type: "error", error };
  }
}

export async function fetchAndApplyAsync() {
  const update = await Updates.fetchUpdateAsync();
  if (update.isNew) {
    await Updates.reloadAsync();
  }
}
