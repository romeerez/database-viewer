import React, { useEffect, useState } from 'react';
import Modal from '../../Common/Modal/Modal';
import Button from '../../Common/Button/Button';
import Editor, { useEditorRef } from '../../Editor/Editor';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from '../TablePage.context';
import { Spinner } from '../../../icons';
import Error from '../Error/Error';

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
    const { dataChangesService, errorService } = useTablePageContext();
    const editorRef = useEditorRef();
    const isLoading = dataChangesService.getIsLoading();
    const error = errorService.getError();
    const [submitted, setSubmitted] = useState(false);

    const submit = () => {
      const query = editorRef.current?.getValue();
      if (query) {
        dataChangesService.submitUpdate(query);
        setSubmitted(true);
      }
    };

    useEffect(() => {
      if (!isLoading && !error && submitted) {
        onClose();
      }
    }, [isLoading, error, submitted]);

    return (
      <div className="p-4">
        <div className="flex items-center justify-center mb-6 text-lg relative">
          Add data source
        </div>
        <Editor
          editorRef={editorRef}
          disableVim
          autoHeight
          initialValue={dataChangesService.getChangesQuery()}
          paddingTop={12}
          paddingBottom={12}
        />
        <Error />
        <div className="flex-center space-x-4 mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={isLoading}>
            {isLoading && (
              <Spinner size={20} className="-ml-2 mr-2 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </div>
    );
  },
);
