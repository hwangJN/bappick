import { getJSON, setJSON } from "@/src/lib/storage";
import { create } from "zustand";
import type { Filters, MenuItem, SeedData, Settings } from "./types";

type AppState = {
  menus: MenuItem[];
  userMenus: MenuItem[];
  favorites: string[]; // ids
  history: string[]; // recent ids
  settings: Settings;
  removedIds: string[];
  isLoaded: boolean;
  loadSeed: () => Promise<void>;
  pickMenu: () => MenuItem | undefined;
  toggleFavorite: (id: string) => void;
  setCategories: (categories: string[]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  addMenu: (item: Omit<MenuItem, "id"> & { id?: string }) => void;
  updateMenu: (id: string, patch: Partial<MenuItem>) => void;
  deleteMenu: (id: string) => void;
  deleteAnyMenu: (id: string) => void;
  getAllCategories: () => string[];
  getAllCategoriesForInput: () => string[];
};

const DEFAULT_SETTINGS: Settings = {
  categories: ["한식"],
  filters: { noPork: false, noSpicy: false },
};

const STORAGE_KEYS = {
  favorites: "favorites",
  settings: "settings",
  history: "history",
  userMenus: "userMenus",
  removedIds: "removedIds",
};

const DEFAULT_CATEGORY_PRESET = [
  "한식",
  "중식",
  "일식",
  "양식",
  "멕시칸",
  "태국",
  "베트남",
  "인도",
  "중동",
  "베이커리",
  "이탈리안",
  "샐러드",
  "아메리칸",
];

export const useAppStore = create<AppState>()((set, get) => ({
  menus: [],
  userMenus: [],
  favorites: [],
  history: [],
  settings: DEFAULT_SETTINGS,
  removedIds: [],
  isLoaded: false,

  loadSeed: async () => {
    try {
      // Load seed bundled JSON (use relative path to avoid alias issues on cold start)
      let seed: SeedData | undefined;
      try {
        seed = require("../assets/seed.json");
      } catch (e) {
        // Fallback minimal seed to avoid empty UI if bundler misses JSON
        seed = {
          version: 1,
          menus: [
            {
              id: "ko_bibimbap",
              name: "비빔밥",
              category: "한식",
              pork: false,
            },
            { id: "cn_jjajang", name: "짜장면", category: "중식", pork: false },
            { id: "jp_sushi", name: "초밥", category: "일식", pork: false },
            { id: "st_pizza", name: "피자", category: "양식", pork: true },
          ],
        } as SeedData;
      }
      const favorites = await getJSON<string[]>(STORAGE_KEYS.favorites, []);
      const settings = await getJSON<Settings>(
        STORAGE_KEYS.settings,
        DEFAULT_SETTINGS
      );
      const history = await getJSON<string[]>(STORAGE_KEYS.history, []);
      const userMenus = await getJSON<MenuItem[]>(STORAGE_KEYS.userMenus, []);
      const removedIds = await getJSON<string[]>(STORAGE_KEYS.removedIds, []);

      const finalSeed: SeedData = seed ?? { version: 1, menus: [] };
      let allCategories = Array.from(
        new Set(
          [...(finalSeed.menus ?? []), ...userMenus].map((m) => m.category)
        )
      );
      if (allCategories.length === 0) allCategories = DEFAULT_CATEGORY_PRESET;
      // Migrate categories: keep only available ones; if none remain, select all
      const intersected = settings.categories.filter((c) =>
        allCategories.includes(c)
      );
      const preferredDefault = allCategories.includes("한식")
        ? ["한식"]
        : allCategories.length > 0
        ? [allCategories[0]]
        : DEFAULT_CATEGORY_PRESET.slice(0, 1);
      const nextSettings =
        intersected.length === 0
          ? { ...settings, categories: preferredDefault }
          : { ...settings, categories: intersected };

      set({
        menus: finalSeed.menus,
        userMenus,
        favorites,
        settings: nextSettings,
        history,
        removedIds,
        isLoaded: true,
      });
      if (
        settings.categories.length === 0 ||
        intersected.length !== settings.categories.length
      ) {
        void setJSON(STORAGE_KEYS.settings, nextSettings);
      }
    } catch (e) {
      set({ isLoaded: true });
    }
  },

  pickMenu: () => {
    const { menus, userMenus, history, settings, isLoaded, removedIds } = get();
    if (!isLoaded) return undefined;
    if (settings.categories.length === 0) return undefined;
    const list = [...menus, ...userMenus].filter(
      (m) => !removedIds.includes(m.id)
    );
    const filtered = list.filter((m) => {
      const inCategory =
        settings.categories.length === 0 ||
        settings.categories.includes(m.category);
      return inCategory;
    });
    const recent = history.slice(-3);
    const candidates = filtered.filter((m) => !recent.includes(m.id));
    const pool = candidates.length > 0 ? candidates : filtered;
    if (pool.length === 0) return undefined;
    const idx = Math.floor(Math.random() * pool.length);
    const chosen = pool[idx];
    const nextHistory = [...history, chosen.id].slice(-10);
    set({ history: nextHistory });
    void setJSON(STORAGE_KEYS.history, nextHistory);
    return chosen;
  },

  toggleFavorite: (id: string) => {
    const { favorites } = get();
    const exists = favorites.includes(id);
    const next = exists
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    set({ favorites: next });
    void setJSON(STORAGE_KEYS.favorites, next);
  },

  setCategories: (categories: string[]) => {
    const { settings } = get();
    const next = { ...settings, categories };
    set({ settings: next });
    void setJSON(STORAGE_KEYS.settings, next);
  },

  setFilters: (filters: Partial<Filters>) => {
    const { settings } = get();
    const next: Settings = {
      ...settings,
      filters: { ...settings.filters, ...filters },
    };
    set({ settings: next });
    void setJSON(STORAGE_KEYS.settings, next);
  },

  addMenu: (item) => {
    const { menus, userMenus, removedIds } = get();
    const normalize = (s: string) => s.trim().toLowerCase();
    const exists = [...menus, ...userMenus]
      .filter((m) => !removedIds.includes(m.id))
      .some((m) => normalize(m.name) === normalize(item.name));
    if (exists) return;

    const id =
      item.id ??
      (item.name || "item")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") +
        "_" +
        Date.now().toString(36);
    const nextItem: MenuItem = {
      id,
      name: item.name,
      category: item.category,
      tags: item.tags ?? [],
      pork: item.pork ?? false,
      image: item.image,
      emoji: item.emoji,
    };
    const next = [...get().userMenus, nextItem];
    set({ userMenus: next });
    void setJSON(STORAGE_KEYS.userMenus, next);
  },

  updateMenu: (id, patch) => {
    const next = get().userMenus.map((m) =>
      m.id === id ? { ...m, ...patch, id: m.id } : m
    );
    set({ userMenus: next });
    void setJSON(STORAGE_KEYS.userMenus, next);
  },

  deleteMenu: (id) => {
    const next = get().userMenus.filter((m) => m.id !== id);
    set({ userMenus: next });
    void setJSON(STORAGE_KEYS.userMenus, next);
  },

  deleteAnyMenu: (id) => {
    const { userMenus, favorites, removedIds } = get();
    const isUser = userMenus.some((m) => m.id === id);
    if (isUser) {
      const nextUser = userMenus.filter((m) => m.id !== id);
      const nextFav = favorites.filter((f) => f !== id);
      set({ userMenus: nextUser, favorites: nextFav });
      void setJSON(STORAGE_KEYS.userMenus, nextUser);
      void setJSON(STORAGE_KEYS.favorites, nextFav);
    } else {
      if (!removedIds.includes(id)) {
        const nextRemoved = [...removedIds, id];
        const nextFav = favorites.filter((f) => f !== id);
        set({ removedIds: nextRemoved, favorites: nextFav });
        void setJSON(STORAGE_KEYS.removedIds, nextRemoved);
        void setJSON(STORAGE_KEYS.favorites, nextFav);
      }
    }
  },

  getAllCategories: () => {
    const { menus, userMenus, removedIds } = get();
    const cats = Array.from(
      new Set(
        [...menus, ...userMenus]
          .filter((m) => !removedIds.includes(m.id))
          .map((m) => m.category)
      )
    );
    return cats.length > 0 ? cats : DEFAULT_CATEGORY_PRESET;
  },
  getAllCategoriesForInput: () => {
    const { menus, userMenus } = get();
    return Array.from(
      new Set([
        ...DEFAULT_CATEGORY_PRESET,
        ...[...menus, ...userMenus].map((m) => m.category),
      ])
    );
  },
}));
