// ===== Types =====
import type { PurchaseOrderItem } from "./order.types";

// ===== Others =====
import { getCurrencyFormatter } from "@/utils/helper";

// ===== Helpers =====
export const purchaseOrderCurrencyFormatter = getCurrencyFormatter("en");

export const getPurchaseOrderTotalItems = (
  items: PurchaseOrderItem[],
): number => items.length;

export const getPurchaseOrderTotalQuantity = (
  items: PurchaseOrderItem[],
): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

export const getPurchaseOrderTotalAmount = (
  items: PurchaseOrderItem[],
): number => {
  return items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );
};
