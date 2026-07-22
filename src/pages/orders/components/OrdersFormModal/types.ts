export type OrderStatus = "Pending" | "Received" | "Cancelled";

export type OrderItemFormValues = {
  productSku: string;
  quantity: number;
  unitPrice: number;
};

export type OrderFormValues = {
  orderDate: string;
  status: OrderStatus;
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
