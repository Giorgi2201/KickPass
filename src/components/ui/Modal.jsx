import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import Card from "./Card";

function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  confirmVariant = "danger",
}) {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const [titleId] = useState(() => `modal-title-${Date.now()}`);
  const [messageId] = useState(() => `modal-message-${Date.now()}`);

  useEffect(() => {
    if (!isOpen) return;

    // Focus the modal container when modal opens
    modalRef.current?.focus();

    // Trap focus inside modal
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
        return;
      }

      if (event.key !== "Tab") return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  const handleOverlayKeyDown = (event) => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      tabIndex={-1}
    >
      <Card className="mx-4 w-full max-w-md">
        <h2 id={titleId} className="text-xl font-semibold text-white">{title}</h2>
        <p id={messageId} className="mt-2 text-gray-300">{message}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            ref={confirmButtonRef}
            variant={confirmVariant}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Modal;
