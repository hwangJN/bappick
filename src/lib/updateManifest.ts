export type PlatformConfig = {
  latest_version: string;
  recommended_version: string;
  min_supported_version: string;
  recommended_build?: number;
  min_supported_build?: number;
  store_url?: string;
  kill_switch?: boolean;
};

export type RemoteUpdateManifest = {
  updated_at: string;
  ios?: PlatformConfig;
  android?: PlatformConfig;
};

export async function fetchUpdateManifest(url: string, timeoutMs = 6000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as RemoteUpdateManifest;
    return json;
  } finally {
    clearTimeout(id);
  }
}
