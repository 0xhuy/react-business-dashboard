// ===== Others =====
import { getCurrencyFormatter } from "@/utils/helper";
import type { PurchaseOrderItem } from "@/pages/orders/type";

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
