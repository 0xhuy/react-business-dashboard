export type ProductFormValues = {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
};

export type ProductFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  initialValues?: ProductFormValues;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => void;
};
