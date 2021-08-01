import React from 'react';
import { Sync, Plus, Undo, ListCheck, Upload } from 'icons';
import { observer } from 'mobx-react-lite';
import { useKey, useToggle } from 'react-use';
import PreviewChanges from 'components/Table/PreviewChanges/PreviewChanges';
import RemoveButton from 'components/Table/ControlPanel/RemoveButton';
import { useTablePageContext } from 'components/Table/TablePage.context';
import Pagination from 'components/Table/ControlPanel/Pagination';
import Tooltip from 'components/Common/Tooltip/Tooltip';
import cn from 'classnames';

export default observer(function ControlPanel() {
  const { tableDataService, dataChangesService, selectionService } =
    useTablePageContext();
  const [openPreviewChanges, togglePreviewChanges] = useToggle(false);

  const hasChanges = dataChangesService.hasChanges();

  const reload = () => tableDataService.sync();

  const addRow = () => dataChangesService.addRow();

  const revertSelected = () => selectionService.revertSelected();

  useKey('r', (e) => {
    if (e.altKey) reload();
  });

  useKey('+', (e) => {
    if (e.altKey) addRow();
  });

  useKey('z', (e) => {
    if (e.altKey) revertSelected();
  });

  return (
    <>
      <PreviewChanges
        open={openPreviewChanges}
        onClose={togglePreviewChanges}
      />
      <div className="flex items-center px-2 text-sm border-b border-dark-4">
        <Pagination />
        <Tooltip text="Reload page" hotkey="alt+r">
          <button
            className="w-8 h-8 flex-center rounded hover:bg-lighter"
            onClick={reload}
          >
            <Sync size={20} />
          </button>
        </Tooltip>
        <Tooltip text="Add row" hotkey="alt++">
          <button
            className="w-8 h-8 flex-center rounded hover:bg-lighter"
            onClick={addRow}
          >
            <Plus size={20} />
          </button>
        </Tooltip>
        <RemoveButton />
        <Tooltip text="Revert selected" hotkey="alt+z">
          <button
            className={cn(
              'w-8 h-8 flex-center rounded hover:bg-lighter',
              !hasChanges && 'opacity-50',
            )}
            onClick={revertSelected}
            disabled={!hasChanges}
          >
            <Undo size={20} />
          </button>
        </Tooltip>
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
          <button className="w-8 h-8 flex-center rounded hover:bg-lighter">
            <Upload size={20} />
          </button>
        </Tooltip>
      </div>
    </>
  );
});
