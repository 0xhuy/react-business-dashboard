import type { ProductFormValues } from "@/features/products/product.types";

export type ProductFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  initialValues?: ProductFormValues;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void;
};
