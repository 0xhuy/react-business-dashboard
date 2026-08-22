// ===== Types =====
import type { ProductStatus } from "./product.types";

// ===== Helpers =====
export const getProductStatus = (stock: number): ProductStatus => {
  if (stock === 0) return "OutOfStock";
  if (stock <= 20) return "LowStock";

  return "InStock";
};
