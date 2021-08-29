import React from 'react';
import { observer } from 'mobx-react-lite';
import Row from './Row';
import cn from 'classnames';
import { useTablePageContext } from '../TablePage.context';

export default observer(function Table() {
  const { tableRef, tableService, selectionService, tableDataService } =
    useTablePageContext();
  const fields = tableDataService.getFields();
  const rows = tableDataService.getRows();

  if (!fields || !rows) return null;

  return (
    <table
      ref={tableRef}
      className="border-r border-dark-4 text-sm text-left user-select-none select-none"
    >
      <thead>
        <tr>
          <th className="h-10 border-b border-l border-dark-4 max-w-sm truncate px-3 bg-dark-3 sticky z-10 top-0 w-px" />
          {fields.map((field, i) => {
            const isSelected = selectionService.isColumnSelected(i);

            return (
              <th
                key={field.name}
                tabIndex={-1}
                {...tableService.getColumnProps(i)}
                className="h-10 border-b border-l border-dark-4 bg-dark-3 sticky z-10 top-0"
              >
                <div
                  className={cn(
                    'min-w-full min-h-full flex items-center max-w-sm truncate px-4 pointer-events-none',
                    isSelected && 'bg-lighter-4',
                  )}
                >
                  {field.name}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className="bg-darker">
        {rows.map((_, i) => (
          <Row key={i} fields={fields} rowIndex={i} />
        ))}
      </tbody>
    </table>
  );
});
