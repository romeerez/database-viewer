import React from 'react';
import Tooltip from '../../Common/Tooltip/Tooltip';
import { Undo } from '../../../icons';
import { useTablePageContext } from '../TablePage.context';
import cn from 'classnames';

export default function UndoButton() {
  const { selectionService, dataChangesService } = useTablePageContext();
  const hasChange = selectionService.use(
    (state) => state.hasChangesInSelection,
  );

  const undo = () => {
    const { add, remove, change } = selectionService.getChangesInfo();
    dataChangesService.removeRows(add);
    dataChangesService.unmarkRemovedRows(remove);
    dataChangesService.undoChanges(change);
  };

  return (
    <Tooltip text="Revert selection" hotkey="ctrl+alt+z">
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
}
