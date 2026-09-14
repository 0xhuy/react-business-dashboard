import type { PurchaseOrderMutationPayload } from "@/features/orders/order.types";

export type OrderFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  initialValues?: PurchaseOrderMutationPayload;
  onClose: () => void;
  onSubmit: (data: PurchaseOrderMutationPayload) => void;
};
