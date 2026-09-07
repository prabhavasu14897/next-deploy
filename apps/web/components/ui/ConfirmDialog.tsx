import { useEffect, useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { DialogActions } from "./DialogActions";
import { TextField } from "./TextField";

/** A single-decision "are you sure?" dialog — Cancel + a danger or primary
 *  confirm action. Generalizes the delete-confirmation pattern so any
 *  destructive (or just consequential) action can reuse it instead of
 *  hand-rolling the same Dialog + DialogActions markup.
 *
 *  Pass `confirmationText` to require the user to type that exact value
 *  before the confirm button enables — the standard "type the name to
 *  delete" guard for higher-stakes destructive actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  titleId,
  title,
  description,
  confirmLabel,
  danger = true,
  confirmationText,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titleId: string;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  confirmationText?: string;
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  const confirmDisabled = confirmationText !== undefined && typed !== confirmationText;

  return (
    <Dialog open={open} onClose={onClose} titleId={titleId} width="22rem">
      <h2 id={titleId} className="pr-6 text-[16px] font-bold text-on-surface">
        {title}
      </h2>
      <p className="mt-2 text-[16px] leading-snug text-on-surface-variant">{description}</p>
      {confirmationText !== undefined && (
        <TextField
          label={`Type "${confirmationText}" to confirm`}
          id="confirm-dialog-typed-value"
          className="mt-3"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          autoFocus
        />
      )}
      <DialogActions>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          size="sm"
          disabled={confirmDisabled}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
