import React from 'react';
import Modal from '../../components/Common/Modal/Modal';
import ServerForm from '../../components/Server/Form/ServerForm';

export default function FormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-lg" closeButton>
      {(onClose) => <ServerForm onClose={onClose} />}
    </Modal>
  );
}
