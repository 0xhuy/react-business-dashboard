import type {
  PurchaseOrderMutationPayload,
  PurchaseOrderRow,
} from "@/features/orders/order.types";

export type OrderState = {
  orders: PurchaseOrderRow[];
  loading: boolean;
  isProcessing: boolean;
  error: string | null;
};

export type UpdatePurchaseOrderPayload = {
  id: string;
  order: PurchaseOrderMutationPayload;
};
