export type PurchaseOrderStatus = "Pending" | "Received" | "Cancelled";

export type PurchaseOrderItem = {
  id?: string;
  productId?: string | null;
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type PurchaseOrderRow = {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  status: PurchaseOrderStatus;
  note: string;
  items: PurchaseOrderItem[];
};

export type PurchaseOrderMutationPayload = {
  supplier: string;
  orderDate: string;
  status: PurchaseOrderStatus;
  note: string;
  items: Array<Pick<PurchaseOrderItem, "productSku" | "quantity" | "unitPrice">>;
};

export type PurchaseOrderFilterValues = {
  status?: string;
  orderDate?: boolean;
  fromDate?: string;
  toDate?: string;
};

export type OrderItemFormValues = {
  productSku: string;
  quantity: number;
  unitPrice: number;
};

export type OrderFormValues = {
  supplier: string;
  orderDate: string;
  status: PurchaseOrderStatus;
  note: string;
  items: OrderItemFormValues[];
};
