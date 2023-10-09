import { useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { IConfirmDialogProps } from "./types";
import * as styles from "./styles";
import { LoadingButton } from "@mui/lab";

const ConfirmDialog = (props: IConfirmDialogProps) => {
  const {
    open,
    hiddenClose,
    closeLabel,
    submitLabel,
    submitLoading,
    title,
    children,
    maxWidth,
    fullWidth,
    needSecondConfirm,
    onClose,
    onCancel,
    onSubmit,
  } = props;

  const handleCancel = useCallback(() => {
    onCancel?.();
    onClose();
  }, [onCancel, onClose]);

  const handleSubmit = useCallback(() => {
    onSubmit?.();
    !needSecondConfirm && onClose();
  }, [onSubmit, onClose, needSecondConfirm]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {title ? (
        <DialogTitle id="confirm-dialog-title" sx={styles.dialogTitle}>
          {title ?? "Confirmation"}
        </DialogTitle>
      ) : null}
      <DialogContent sx={styles.dialogContent}>{children}</DialogContent>
      <DialogActions sx={styles.dialogActions(Boolean(hiddenClose))}>
        {!hiddenClose && (
          <Button sx={styles.closeButton} onClick={handleCancel}>
            {closeLabel ?? "کنسل"}
          </Button>
        )}
        <LoadingButton
          variant="contained"
          loading={submitLoading}
          onClick={handleSubmit}
          sx={styles.submitButton}
        >
          {submitLabel ?? "تایید"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.defaultProps = {
  hiddenClose: false,
};

export { ConfirmDialog };
export default ConfirmDialog;
