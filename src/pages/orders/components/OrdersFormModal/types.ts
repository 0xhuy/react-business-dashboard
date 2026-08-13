import type { PurchaseOrderStatus } from "@/features/orders/order.types";

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

export type OrderFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  initialValues?: OrderFormValues;
  onClose: () => void;
  onSubmit: (data: OrderFormValues) => void;
};
