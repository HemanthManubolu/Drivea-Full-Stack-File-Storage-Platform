import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertCircleIcon } from "lucide-react";

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Delete",
    confirmVariant = "danger",
    isLoading = false,
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex items-center gap-4 mb-6">
                <AlertCircleIcon className="size-8 text-red-600 bg-red-50 p-1.5 rounded-full shrink-0" />
                <div>
                    <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
}
