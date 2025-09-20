import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open && closeButtonRef.current) {
      // החזרת פוקוס לכפתור אחרי סגירה
      closeButtonRef.current.focus();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button ref={closeButtonRef} onClick={onClose} color="secondary">
          ביטול
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          אישור
        </Button>
      </DialogActions>
    </Dialog>
  );
}
