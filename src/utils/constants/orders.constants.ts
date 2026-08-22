// ===== Others =====
import type {
  PurchaseOrderFilterValues,
  OrderFormValues,
} from "@/features/orders/order.types";

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
    value: "Pending",
  },
  {
    label: "Received",
    value: "Received",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
  },
] as const;

export const ORDER_STATUS_OPTIONS = [
  {
    label: "orders.status_pending",
    value: "Pending",
  },
  {
    label: "orders.status_received",
    value: "Received",
  },
  {
    label: "orders.status_cancelled",
    value: "Cancelled",
  },
];

export const DEFAULT_ORDER_FORM_VALUES: OrderFormValues = {
  supplier: "",
  orderDate: "",
  status: "Pending",
  note: "",
  items: [
    {
      productSku: "",
      quantity: 1,
      unitPrice: 0,
    },
  ],
};
