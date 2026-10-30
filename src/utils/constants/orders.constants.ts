// ===== Others =====
import type {
  PurchaseOrderFilterValues,
  PurchaseOrderMutationPayload,
} from "@/features/orders/order.types";
import { OrderStatusEnum } from "@/utils/enum";

// ===== Constants =====
export const DEFAULT_PURCHASE_ORDER_FILTER_VALUES: PurchaseOrderFilterValues = {
  status: "",
  orderDate: false,
  fromDate: "",
  toDate: "",
};

export const PURCHASE_ORDER_STATUS_OPTIONS = [
  {
    label: "All Status",
    value: "all",
  },
  {
    label: "Pending",
    value: OrderStatusEnum.PENDING,
  },
  {
    label: "Received",
    value: OrderStatusEnum.RECEIVED,
  },
  {
    label: "Cancelled",
    value: OrderStatusEnum.CANCELLED,
  },
] as const;

export const ORDER_STATUS_OPTIONS = [
  {
    label: "orders.status_pending",
    value: OrderStatusEnum.PENDING,
  },
  {
    label: "orders.status_received",
    value: OrderStatusEnum.RECEIVED,
  },
  {
    label: "orders.status_cancelled",
    value: OrderStatusEnum.CANCELLED,
  },
] as const;

export const DEFAULT_ORDER_FORM_VALUES: PurchaseOrderMutationPayload = {
  supplier: "",
  orderDate: "",
  status: OrderStatusEnum.PENDING,
  note: "",
  items: [
    {
      productSku: "",
      quantity: 1,
      unitPrice: 0,
    },
  ],
};
