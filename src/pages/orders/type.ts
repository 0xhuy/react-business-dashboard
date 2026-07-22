export type PurchaseOrderStatus = "Pending" | "Received" | "Cancelled";

export type PurchaseOrderFilterValues = {
  status?: string;
  orderDate?: boolean;
  fromDate?: string;
  toDate?: string;
};

export type PurchaseOrderItem = {
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type PurchaseOrderRow = {
  poNumber: string;
  orderDate: string;
  status: PurchaseOrderStatus;
  note: string;
  items: PurchaseOrderItem[];
};
