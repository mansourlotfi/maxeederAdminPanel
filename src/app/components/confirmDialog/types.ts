export interface IConfirmDialogProps {
  open: boolean;
  hiddenClose?: boolean;
  title?: React.ReactNode | string;
  closeLabel?: string;
  submitLabel?: string;
  submitLoading?: boolean;
  children?: React.ReactNode | string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  needSecondConfirm?: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
}
