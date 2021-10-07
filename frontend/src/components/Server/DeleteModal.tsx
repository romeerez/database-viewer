import React from 'react';
import { ServerInLocalStore } from './types';
import { useRemoveServer } from './server.service';
import ConfirmModal from '../../components/Common/Modals/ConfirmModal';

export default function DeleteModal({
  server,
  onClose,
}: {
  server: ServerInLocalStore;
  onClose(): void;
}) {
  const { remove, loading } = useRemoveServer();

  return (
    <ConfirmModal
      open
      onClose={onClose}
      onConfirm={async (close) => {
        if (await remove(server)) close();
      }}
      text={
        <>
          Are you sure to delete{' '}
          <span className="text-accent">{server.name}</span> data source?
        </>
      }
      loading={loading}
    />
  );
}
