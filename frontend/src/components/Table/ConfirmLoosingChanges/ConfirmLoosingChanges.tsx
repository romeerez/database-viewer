import React from 'react';
import ConfirmModal from '../../Common/Modals/ConfirmModal';
import { useTablePageContext } from '../TablePage.context';

export default function ConfirmLoosingChanges() {
  const { confirmLoosingChangesService: service } = useTablePageContext();

  const confirmCallback = service.use('confirmCallback');

  if (!confirmCallback) return null;

  return (
    <ConfirmModal
      open
      onClose={() => service.set({ confirmCallback: undefined })}
      onConfirm={(close) => {
        confirmCallback();
        close();
      }}
      text="Changes are not submitted. Data will be lost. Continue?"
      cancelText="No"
      confirmText="Yes"
    />
  );
}
