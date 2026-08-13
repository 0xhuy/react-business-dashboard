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
