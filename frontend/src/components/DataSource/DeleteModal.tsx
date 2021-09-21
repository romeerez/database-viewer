import React from 'react';
import { modalsState } from '../DataTree/dataTree.state';
import { DataSourceInLocalStore } from './types';
import { useRemoveDataSource } from './dataSource.service';
import ConfirmModal from '../../components/Common/Modals/ConfirmModal';

export default function DeleteModal({
  dataSource,
}: {
  dataSource: DataSourceInLocalStore;
}) {
  const { remove, loading } = useRemoveDataSource();

  return (
    <ConfirmModal
      open
      onClose={() => modalsState.setDataSourceForDelete()}
      onConfirm={async (close) => {
        if (await remove(dataSource)) close();
      }}
      text={
        <>
          Are you sure to delete{' '}
          <span className="text-accent">{dataSource.name}</span> data source?
        </>
      }
      loading={loading}
    />
  );
}
