import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

/**
 * Accessible native modal <dialog> matching HSBC Cards UI styling.
 * Handles Esc dismissal, light-dismiss backdrop clicks safely, and scroll containment.
 */
export const ModalDialog: React.FC<ModalDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  maxWidthClass = 'max-w-md',
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const pressedOutsideRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const isOutsideDialogBox = (e: React.PointerEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    );
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: 'any' } as any)}
      onCancel={e => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => onClose()}
      onPointerDown={e => {
        pressedOutsideRef.current = isOutsideDialogBox(e);
      }}
      onPointerUp={e => {
        if (pressedOutsideRef.current && isOutsideDialogBox(e)) {
          onClose();
        }
        pressedOutsideRef.current = false;
      }}
      className={`m-auto w-[calc(100vw-2rem)] ${maxWidthClass} max-h-[88dvh] bg-white text-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-200 p-0 overflow-hidden backdrop:bg-slate-900/55`}
    >
      <div className="flex flex-col max-h-[88dvh]">
        {/* Crisp Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 shrink-0 bg-white">
          <div className="min-w-0">
            <h2 id={titleId} className="text-[16px] font-bold text-[#1f1f1f] leading-snug">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] text-[#777777] mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-full text-gray-500 hover:text-[#1f1f1f] hover:bg-[#F2F4F7] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </dialog>
  );
};
