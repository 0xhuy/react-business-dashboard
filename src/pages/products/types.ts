import type { ProductRow, ProductStatus } from "@/features/products/product.types";

export type ProductFilterValues = {
  category?: ProductRow["category"] | "all" | "";
  status?: ProductStatus | "all" | "";
};
