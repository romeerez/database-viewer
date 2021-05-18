import React from 'react';
import Modal from 'components/Common/Modal/Modal';
import ConnectForm from 'components/DataSource/Connect/ConnectForm';
import { useToggle } from 'react-use';
import { Plus } from 'icons';

export default function AddConnectionButton() {
  const [showConnectModal, toggleConnectModal] = useToggle(false);

  return (
    <>
      <Modal open={showConnectModal} onClose={toggleConnectModal}>
        {(onClose) => <ConnectForm onClose={onClose} />}
      </Modal>
      <button className="w-6 h-6 ml-2 flex-center" onClick={toggleConnectModal}>
        <Plus size={16} />
      </button>
    </>
  );
}
