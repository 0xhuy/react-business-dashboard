// ===== Libs =====
import type { TFunction } from "i18next";

// ===== Types =====
import type { PurchaseOrderRow, PurchaseOrderStatus } from "@/features/orders/order.types";
import type { ProductRow } from "@/features/products/product.types";
import type {
  DashboardChartItem,
  DashboardLowStockProduct,
} from "./types";

// ===== Others =====
import { getProductStatus } from "@/features/products/product.helpers";
import { PRODUCT_CATEGORY_OPTIONS } from "@/utils/constants";
import {
  DASHBOARD_LOW_STOCK_LIMIT,
  DASHBOARD_PRODUCT_CHART_LIMIT,
  DASHBOARD_RECENT_ORDER_LIMIT,
} from "./constants";

const PURCHASE_ORDER_STATUSES: PurchaseOrderStatus[] = [
  "Pending",
  "Received",
  "Cancelled",
];

export const getStockAlertProducts = (
  products: ProductRow[],
): ProductRow[] => {
  return products.filter(
    (product) => getProductStatus(product.stock) !== "InStock",
  );
};

export const getLowestStockProducts = (
  products: ProductRow[],
): DashboardLowStockProduct[] => {
  return [...getStockAlertProducts(products)]
    .sort((firstProduct, secondProduct) => firstProduct.stock - secondProduct.stock)
    .slice(0, DASHBOARD_LOW_STOCK_LIMIT);
};

export const getProductChartData = (
  products: ProductRow[],
  t: TFunction,
): DashboardChartItem[] => {
  const categoryTotals = new Map<string, number>();

  products.forEach((product) => {
    categoryTotals.set(
      product.category,
      (categoryTotals.get(product.category) ?? 0) + 1,
    );
  });

  return [...categoryTotals.entries()]
    .map(([category, value]) => {
      const categoryOption = PRODUCT_CATEGORY_OPTIONS.find(
        (option) => option.value === category,
      );

      return {
        label: categoryOption ? t(categoryOption.label) : category,
        value,
      };
    })
    .sort((firstItem, secondItem) => secondItem.value - firstItem.value)
    .slice(0, DASHBOARD_PRODUCT_CHART_LIMIT);
};

export const getPurchaseOrderChartData = (
  orders: PurchaseOrderRow[],
  t: TFunction,
): DashboardChartItem[] => {
  const statusTotals = new Map<PurchaseOrderStatus, number>();

  orders.forEach((order) => {
    statusTotals.set(order.status, (statusTotals.get(order.status) ?? 0) + 1);
  });

  return PURCHASE_ORDER_STATUSES.map((status) => ({
    label: t(`orders.status_${status.toLowerCase()}`),
    value: statusTotals.get(status) ?? 0,
  }));
};

export const getRecentPurchaseOrders = (
  orders: PurchaseOrderRow[],
): PurchaseOrderRow[] => {
  return [...orders]
    .sort(
      (firstOrder, secondOrder) =>
        new Date(secondOrder.orderDate).getTime() -
        new Date(firstOrder.orderDate).getTime(),
    )
    .slice(0, DASHBOARD_RECENT_ORDER_LIMIT);
};
