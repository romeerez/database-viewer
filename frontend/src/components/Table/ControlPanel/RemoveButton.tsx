import React from 'react';
import { useTablePageContext } from '../../../components/Table/TablePage.context';
import { Minus } from '../../../icons';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import Tooltip from '../../../components/Common/Tooltip/Tooltip';
import { useKey } from 'react-use';

export default observer(function RemoveRowsButton() {
  const { selectionService } = useTablePageContext();
  const disabled = !selectionService.hasSelection();
  const removeRows = () => selectionService.removeRows();

  useKey(
    'y',
    (e) => {
      if (e.ctrlKey) removeRows();
    },
    {},
  );

  return (
    <Tooltip text="Delete selected rows" hotkey="ctrl+y">
      <button
        className={cn(
          'w-8 h-8 flex-center rounded hover:bg-lighter',
          disabled && 'opacity-50',
        )}
        disabled={disabled}
        onMouseDown={(e) => {
          e.preventDefault();
          removeRows();
        }}
      >
        <Minus size={20} />
      </button>
    </Tooltip>
  );
});
