import React from 'react';
import Modal from '../../../components/Common/Modal/Modal';
import Button from '../../../components/Common/Button/Button';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  text,
  loading = false,
  cancelText = 'Cancel',
  confirmText = 'Delete',
}: {
  open: boolean;
  onClose(): void;
  onConfirm(close: () => void): void;
  text: React.ReactNode;
  loading?: boolean;
  cancelText?: string;
  confirmText?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-md"
      closeButton
      closeOnEscape
    >
      {(close) => (
        <>
          <div className="py-4 px-10 text-center">{text}</div>
          <div className="flex-center pb-4">
            <button className="btn mr-2" onClick={close}>
              {cancelText}
            </button>
            <Button
              addClass="focus-visible"
              autoFocus
              loading={loading}
              onClick={() => onConfirm(close)}
            >
              {confirmText}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
