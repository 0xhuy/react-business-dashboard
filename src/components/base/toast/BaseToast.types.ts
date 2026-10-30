export type BaseToastProps = {
  isOpen: boolean;
  message: string;
  variant?: "success" | "error";
  duration?: number;
  onClose: () => void;
};
