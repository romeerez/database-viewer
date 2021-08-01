import React from 'react';
import Modal from '../../../components/Common/Modal/Modal';
import Button from '../../../components/Common/Button/Button';
import Editor, { useEditorRef } from '../../../components/Editor/Editor';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from '../../../components/Table/TablePage.context';

export default observer(function PreviewChanges({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-3xl" closeButton>
      {(onClose) => <PreviewChangesModalInner onClose={onClose} />}
    </Modal>
  );
});

const PreviewChangesModalInner = observer(
  ({ onClose }: { onClose: () => void }) => {
    const { tableDataService, dataChangesService } = useTablePageContext();
    const editorRef = useEditorRef();

    const primaryColumnNames = tableDataService.getPrimaryColumnNames();
    const rows = tableDataService.getRows();

    if (!primaryColumnNames || !rows) return null;

    const removedRows = dataChangesService.getRemovedRows();

    const rowChanges = dataChangesService.getRowChanges();

    const newRows = dataChangesService.getNewRows();

    console.log({
      removedRows,
      rowChanges,
      newRows,
    });

    return (
      <div className="p-4">
        <div className="flex items-center justify-center mb-6 text-lg relative">
          Add data source
        </div>
        <Editor
          editorRef={editorRef}
          disableVim
          autoHeight
          initialValue={'INSERT INTO blabla'}
          paddingTop={12}
          paddingBottom={12}
        />
        <div className="flex-center space-x-4 mt-6">
          <Button>Cancel</Button>
          <Button>Submit</Button>
        </div>
      </div>
    );
  },
);
