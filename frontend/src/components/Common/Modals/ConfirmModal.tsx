import React from 'react';
import Modal from '../../../components/Common/Modal/Modal';
import Button from '../../../components/Common/Button/Button';

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  text,
  loading = false,
}: {
  open: boolean;
  onClose(): void;
  onConfirm(close: () => void): void;
  text: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md" closeButton>
      {(close) => (
        <>
          <div className="py-4 px-10 text-center">{text}</div>
          <div className="flex-center pb-4">
            <button className="btn mr-2" onClick={close}>
              Cancel
            </button>
            <Button
              addClass="focus-visible"
              autoFocus
              loading={loading}
              onClick={() => onConfirm(close)}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
