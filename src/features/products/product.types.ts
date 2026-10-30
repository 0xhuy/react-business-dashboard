// ============================================================
// PRODUCT TYPES
// ============================================================

import { PRODUCT_STATUS } from "@/utils/constants/product.constants";

export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export type ProductRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
};

export type ProductMutationPayload = Omit<ProductRow, "id">;

export type ProductDraft = ProductMutationPayload & {
  id?: string;
};

export type ProductFilterValues = {
  category?: ProductRow["category"] | "all" | "";
  status?: ProductStatus | "all" | "";
};
