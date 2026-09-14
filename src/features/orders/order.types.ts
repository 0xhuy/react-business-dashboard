import type { OrderStatusEnum } from "@/utils/enum";

export type PurchaseOrderStatus = OrderStatusEnum;

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
  status?: PurchaseOrderStatus | "all" | "";
  orderDate?: boolean;
  fromDate?: string;
  toDate?: string;
};
