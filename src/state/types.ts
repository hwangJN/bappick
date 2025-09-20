export type MenuItem = {
  id: string;
  name: string;
  category: "Korean" | "Japanese" | "Chinese" | "Western" | "Snack" | string;
  tags?: string[];
  emoji?: string;
  pork?: boolean;
  image?: string;
};

export type Filters = {
  noPork: boolean;
  noSpicy: boolean;
};

export type Settings = {
  categories: string[];
  filters: Filters;
};

export type SeedData = {
  version: number;
  menus: MenuItem[];
};
