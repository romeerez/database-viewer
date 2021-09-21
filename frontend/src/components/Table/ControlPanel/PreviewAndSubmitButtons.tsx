import React from 'react';
import PreviewChanges from '../PreviewChanges/PreviewChanges';
import Tooltip from '../../Common/Tooltip/Tooltip';
import cn from 'classnames';
import { ListCheck, Upload, Spinner } from '../../../icons';
import { useToggle } from 'react-use';
import { useTablePageContext } from '../TablePage.context';

export default function PreviewAndSubmitButtons() {
  const { dataChangesService } = useTablePageContext();
  const [openPreviewChanges, togglePreviewChanges] = useToggle(false);
  const hasChanges = dataChangesService.use((state) => state.hasChanges);
  const isLoading = dataChangesService.use((state) => state.isLoading);

  const submit = () => {
    dataChangesService.submitUpdate(dataChangesService.getChangesQuery());
  };

  return (
    <>
      <PreviewChanges
        open={openPreviewChanges}
        onClose={togglePreviewChanges}
      />
      <Tooltip text="Preview pending changes">
        <button
          className={cn(
            'w-8 h-8 flex-center rounded hover:bg-lighter',
            !hasChanges && 'opacity-50',
          )}
          onClick={togglePreviewChanges}
          disabled={!hasChanges}
        >
          <ListCheck size={20} />
        </button>
      </Tooltip>
      <Tooltip text="Submit">
        <button
          className={cn(
            'w-8 h-8 flex-center rounded hover:bg-lighter',
            !hasChanges && 'opacity-50',
          )}
          onClick={submit}
          disabled={!hasChanges || isLoading}
        >
          {!isLoading && <Upload size={20} />}
          {isLoading && <Spinner size={20} className="animate-spin" />}
        </button>
      </Tooltip>
    </>
  );
}
