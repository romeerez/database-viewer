import React from 'react';
import Modal from '../../../components/Common/Modal/Modal';
import ServerForm from '../../../components/Server/Form/ServerForm';
import DeleteModal from '../../../components/Server/DeleteModal';
import { useDataTreeContext } from '../dataTree.context';

export default function DataTreeModals() {
  const { modalsService } = useDataTreeContext();

  const { serverForEdit, serverForDelete } = modalsService.use(
    'serverForEdit',
    'serverForDelete',
  );

  if (serverForEdit) {
    return (
      <Modal
        open
        onClose={() => modalsService.setServerForEdit()}
        className="max-w-lg"
        closeButton
      >
        {(close) => <ServerForm onClose={close} server={serverForEdit} />}
      </Modal>
    );
  }

  if (serverForDelete) {
    return (
      <DeleteModal
        server={serverForDelete}
        onClose={() => modalsService.setServerForDelete()}
      />
    );
  }

  return null;
}
