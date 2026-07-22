// ===== Others =====
import type {
  PurchaseOrderFilterValues,
  PurchaseOrderRow,
} from "@/pages/orders/type";
import type { OrderFormValues } from "@/pages/orders/components/OrdersFormModal/types";
import type { ProductFormValues } from "@/pages/products/components/ProductFormModal/types";

// ===== Constants =====
export const PURCHASE_ORDER_DATA_SOURCE: PurchaseOrderRow[] = [
  {
    poNumber: "PO-0001",
    orderDate: "2026-06-30",
    status: "Pending",
    note: "Initial stock purchase",
    items: [
      {
        productSku: "PRD-001",
        productName: "Wireless Mouse",
        quantity: 20,
        unitPrice: 29.99,
      },
      {
        productSku: "PRD-002",
        productName: "Mechanical Keyboard",
        quantity: 10,
        unitPrice: 89.99,
      },
      {
        productSku: "PRD-003",
        productName: "Mechanical Keyboard",
        quantity: 10,
        unitPrice: 89.99,
      },
      {
        productSku: "PRD-004",
        productName: "Mechanical Keyboard",
        quantity: 10,
        unitPrice: 89.99,
      },
    ],
  },
];

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

export const PRODUCT_DATA_SOURCE: ProductFormValues[] = [
  {
    sku: "PRD-001",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 29.99,
    stock: 120,
    description: "Ergonomic wireless mouse",
  },
  {
    sku: "PRD-002",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 89.99,
    stock: 45,
    description: "RGB mechanical keyboard",
  },
  {
    sku: "PRD-003",
    name: "Office Chair",
    category: "Furniture",
    price: 199.99,
    stock: 18,
    description: "Comfortable office chair",
  },
  {
    sku: "PRD-004",
    name: "Water Bottle",
    category: "Lifestyle",
    price: 15.5,
    stock: 250,
    description: "Stainless steel bottle",
  },
  {
    sku: "PRD-005",
    name: "Notebook",
    category: "Stationery",
    price: 4.99,
    stock: 500,
    description: "A5 lined notebook",
  },
];

export const PRODUCT_OPTIONS = PRODUCT_DATA_SOURCE.map((product) => ({
  label: product.name,
  value: product.sku,
}));

export const DEFAULT_ORDER_FORM_VALUES: OrderFormValues = {
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
