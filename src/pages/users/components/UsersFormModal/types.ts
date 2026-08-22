import type {
  UserFormInitialValues,
  UserFormValues,
} from "@/features/users/user.types";

export type UserFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  isCurrentUser?: boolean;
  initialValues?: UserFormInitialValues;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => void;
};
