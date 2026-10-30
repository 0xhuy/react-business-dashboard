import type { ProductMutationPayload } from "@/features/products/product.types";

export type ProductFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  initialValues?: ProductMutationPayload;
  onClose: () => void;
  onSubmit: (data: ProductMutationPayload) => void;
};
