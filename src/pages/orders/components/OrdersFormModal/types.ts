import type { OrderFormValues } from "@/features/orders/order.types";

export type OrderFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  initialValues?: OrderFormValues;
  onClose: () => void;
  onSubmit: (data: OrderFormValues) => void;
};
