export function pickRandom<T>(
  items: T[],
  recentItems: T[],
  recentWindow: number = 3
): T | undefined {
  if (!Array.isArray(items) || items.length === 0) return undefined;

  const recentSlice = recentItems.slice(-recentWindow);
  const candidates = items.filter((it) => !recentSlice.includes(it));
  const pool = candidates.length > 0 ? candidates : items;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
