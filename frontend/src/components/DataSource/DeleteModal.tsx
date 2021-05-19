import React from 'react';
import Modal from 'components/Common/Modal/Modal';
import { modalsState } from 'components/DataTree/dataTree.state';
import Button from 'components/Common/Button/Button';
import { DataSourceInLocalStore } from 'components/DataSource/types';
import { useRemoveDataSource } from 'components/DataSource/dataSource.service';

export default function DeleteModal({
  dataSource,
}: {
  dataSource: DataSourceInLocalStore;
}) {
  const { remove, loading } = useRemoveDataSource();

  return (
    <Modal
      open
      onClose={() => modalsState.setDataSourceForDelete()}
      className="max-w-sm"
      closeButton
    >
      {(close) => (
        <>
          <div className="p-4 text-center">
            Are you sure to delete{' '}
            <span className="text-accent">{dataSource.name}</span> data source?
          </div>
          <div className="flex-center pb-4">
            <button className="btn mr-2" onClick={close}>
              Cancel
            </button>
            <Button
              loading={loading}
              onClick={async () => {
                if (await remove(dataSource)) close();
              }}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
