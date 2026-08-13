import type {
  ProductDraft,
  ProductMutationPayload,
  ProductRow,
} from "@/features/products/product.types";

export type ProductState = {
  products: ProductRow[];
  loading: boolean;
  isProcessing: boolean;
  error: string | null;
};

export type UpdateProductPayload = {
  id: string;
  product: ProductMutationPayload;
};

export type SaveProductsPayload = {
  products: ProductDraft[];
  deletedIds: string[];
};
