import type {
  ProductRow,
  ProductStatus,
} from "@/features/products/product.types";
import type { ProductFilterValues } from "./types";

export const getProductStatus = (stock: number): ProductStatus => {
  if (stock === 0) return "OutOfStock";
  if (stock <= 20) return "LowStock";

  return "InStock";
};

export const filterProducts = (
  products: ProductRow[],
  searchValue: string,
  filters: ProductFilterValues,
): ProductRow[] => {
  const normalizedSearch = searchValue.trim().toLowerCase();

  return products.filter((product) => {
    const searchableText = [
      product.sku,
      product.name,
      product.category,
      product.description,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearch || searchableText.includes(normalizedSearch);
    const matchesCategory =
      !filters.category ||
      filters.category === "all" ||
      product.category === filters.category;
    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      getProductStatus(product.stock) === filters.status;

    return matchesSearch && matchesCategory && matchesStatus;
  });
};
