export const PRODUCT_CATEGORY_OPTIONS = [
  {
    label: "products.category_electronics",
    value: "Electronics",
  },
  {
    label: "products.category_furniture",
    value: "Furniture",
  },
  {
    label: "products.category_lifestyle",
    value: "Lifestyle",
  },
  {
    label: "products.category_stationery",
    value: "Stationery",
  },
] as const;

export const DEFAULT_PRODUCT_FILTER_VALUES = {
  category: "",
  status: "",
} as const;

export const PRODUCT_PAGE_SIZE = 10;

export const PRODUCT_SELECT_COLUMNS =
  "id, sku, name, category, price, stock, description";

export const PRODUCT_SEARCH_FIELDS = [
  "sku",
  "name",
  "category",
  "description",
] as const;

export const DEFAULT_PRODUCT_FORM_VALUES = {
  sku: "",
  name: "",
  category: "",
  price: 0,
  stock: 0,
  description: "",
} as const;
