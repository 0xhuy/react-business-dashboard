export type ProductFilterValues = {
  category?: ProductRow["category"] | "all" | "";
  status?: ProductStatus | "all" | "";
};

export type ProductStatus = "InStock" | "LowStock" | "OutOfStock";

export type ProductRow = {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
};
