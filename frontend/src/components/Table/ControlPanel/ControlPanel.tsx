import React from 'react';
import { Sync, Plus } from '../../../icons';
import { observer } from 'mobx-react-lite';
import { useKey } from 'react-use';
import RemoveButton from '../ControlPanel/RemoveButton';
import { useTablePageContext } from '../TablePage.context';
import Pagination from '../ControlPanel/Pagination';
import Tooltip from '../../Common/Tooltip/Tooltip';
import PreviewAndSubmitButtons from './PreviewAndSubmitButtons';

export default observer(function ControlPanel() {
  const { tableDataService, dataChangesService, selectionService } =
    useTablePageContext();

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
    <div className="flex items-center px-2 border-b border-dark-4">
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
      <PreviewAndSubmitButtons />
    </div>
  );
});
