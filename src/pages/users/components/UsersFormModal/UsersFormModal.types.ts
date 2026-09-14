import type { UserMutationPayload } from "@/features/users/user.types";

export type UserFormValues = UserMutationPayload & {
  password: string;
  confirmPassword: string;
};

export type UserFormInitialValues = UserMutationPayload;

export type UserFormModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  isCurrentUser?: boolean;
  initialValues?: UserFormInitialValues;
  onClose: () => void;
  onSubmit: (data: UserFormValues) => void;
};
