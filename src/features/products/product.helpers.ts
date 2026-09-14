// ===== Types =====
import type { ProductStatus } from "./product.types";
import { PRODUCT_STATUS } from "@/utils/constants/product.constants";

// ===== Helpers =====
export const getProductStatus = (stock: number): ProductStatus => {
  if (stock === 0) return PRODUCT_STATUS.OUT_OF_STOCK;
  if (stock <= 20) return PRODUCT_STATUS.LOW_STOCK;

  return PRODUCT_STATUS.IN_STOCK;
};
