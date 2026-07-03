export interface FilterState {
  categories: string[];
  subcategories: string[];
  minRating: number;
  priceMax: number;
}

export const PRICE_MAX = 5000;

export const ALL_CATEGORIES = ["Beauty", "Fashion", "Home & Living"] as const;

export const SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  Beauty: ["Makeup", "Skincare", "Haircare", "Fragrance"],
  Fashion: ["Footwear", "Accessories", "Men's Clothing", "Women's Clothing", "Kids Clothing"],
  "Home & Living": [
    "Appliances", "Bedding", "Dinnerware", "Lighting",
    "Decor", "Bath", "Fitness", "Kitchenware",
    "Furniture", "Home Textile", "Storage",
  ],
};

export const DEFAULT_FILTERS: FilterState = {
  categories: [],
  subcategories: [],
  minRating: 0,
  priceMax: PRICE_MAX,
};
