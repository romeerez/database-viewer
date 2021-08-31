import React from 'react';
import { observer } from 'mobx-react-lite';
import Tooltip from '../../Common/Tooltip/Tooltip';
import { Undo } from '../../../icons';
import { useTablePageContext } from '../TablePage.context';
import cn from 'classnames';

export default observer(function UndoButton() {
  const { selectionService, dataChangesService } = useTablePageContext();
  const hasChange = selectionService.getHasChangesInSelection();

  const undo = () => {
    const { add, remove, change } = selectionService.getChangeInfo();
    dataChangesService.removeRows(add);
    dataChangesService.unmarkRemovedRows(remove);
    dataChangesService.undoChanges(change);
  };

  return (
    <Tooltip text="Add row" hotkey="ctrl+alt+z">
      <button
        className={cn(
          'w-8 h-8 flex-center rounded hover:bg-lighter',
          !hasChange && 'opacity-50',
        )}
        onClick={undo}
        disabled={!hasChange}
      >
        <Undo size={20} />
      </button>
    </Tooltip>
  );
});
