import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { DialogActions } from "./DialogActions";

/** A single-decision "are you sure?" dialog — Cancel + a danger or primary
 *  confirm action. Generalizes the delete-confirmation pattern so any
 *  destructive (or just consequential) action can reuse it instead of
 *  hand-rolling the same Dialog + DialogActions markup. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  titleId,
  title,
  description,
  confirmLabel,
  danger = true,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titleId: string;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} titleId={titleId} width="22rem">
      <h2 id={titleId} className="pr-6 text-[16px] font-bold text-on-surface">
        {title}
      </h2>
      <p className="mt-2 text-[16px] leading-snug text-on-surface-variant">{description}</p>
      <DialogActions>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          size="sm"
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
