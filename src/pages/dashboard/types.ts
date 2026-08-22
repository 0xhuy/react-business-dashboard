import type { ProductRow } from "@/features/products/product.types";

export type DashboardConfig = {
  canViewPurchaseOrders: boolean;
  canViewUsers: boolean;
  productsPath: string;
  purchaseOrdersPath?: string;
};

export type DashboardChartItem = {
  label: string;
  value: number;
};

export type DashboardStatisticCard = {
  title: string;
  value: string;
  description: string;
};

export type DashboardLowStockProduct = Pick<
  ProductRow,
  "id" | "name" | "sku" | "stock"
>;
