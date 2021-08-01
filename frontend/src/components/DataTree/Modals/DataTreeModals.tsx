import React from 'react';
import { observer } from 'mobx-react-lite';
import { modalsState } from '../../../components/DataTree/dataTree.state';
import Modal from '../../../components/Common/Modal/Modal';
import DataSourceForm from '../../../components/DataSource/Form/DataSourceForm';
import DeleteModal from '../../../components/DataSource/DeleteModal';

export default observer(function DataTreeModals() {
  const { dataSourceForEdit, dataSourceForDelete } = modalsState;

  if (dataSourceForEdit) {
    return (
      <Modal
        open
        onClose={() => modalsState.setDataSourceForEdit()}
        className="max-w-lg"
        closeButton
      >
        {(close) => (
          <DataSourceForm onClose={close} dataSource={dataSourceForEdit} />
        )}
      </Modal>
    );
  }

  if (dataSourceForDelete) {
    return <DeleteModal dataSource={dataSourceForDelete} />;
  }

  return null;
});
