// ============================================================
// PRODUCT TYPES
// ============================================================

export type ProductStatus = "InStock" | "LowStock" | "OutOfStock";

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
