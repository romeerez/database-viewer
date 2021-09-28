import React from 'react';
import { modalsState } from '../dataTree.state';
import Modal from '../../../components/Common/Modal/Modal';
import ServerForm from '../../../components/Server/Form/ServerForm';
import DeleteModal from '../../../components/Server/DeleteModal';

export default function DataTreeModals() {
  const { serverForEdit, serverForDelete } = modalsState.use(
    'serverForEdit',
    'serverForDelete',
  );

  if (serverForEdit) {
    return (
      <Modal
        open
        onClose={() => modalsState.setServerForEdit()}
        className="max-w-lg"
        closeButton
      >
        {(close) => <ServerForm onClose={close} server={serverForEdit} />}
      </Modal>
    );
  }

  if (serverForDelete) {
    return <DeleteModal server={serverForDelete} />;
  }

  return null;
}
