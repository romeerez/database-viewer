import React from 'react';
import Modal from 'components/Common/Modal/Modal';
import DataSourceForm from 'components/DataSource/Form/DataSourceForm';

export default function FormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-lg" closeButton>
      {(onClose) => <DataSourceForm onClose={onClose} />}
    </Modal>
  );
}
