import React from 'react';
import Row from './Row';
import { useTablePageContext } from '../TablePage.context';
import ColumnTitle from './ColumnTitle';

export default function Table() {
  const { tableRef, tableDataService } = useTablePageContext();
  const table = tableDataService.use((state) => state.table);
  const fields = tableDataService.use((state) => state.fields);
  const rows = tableDataService.use((state) => state.rows);

  if (!table || !fields || !rows) return null;

  return (
    <table
      ref={tableRef}
      className="border-r border-dark-4 text-sm text-left user-select-none select-none"
    >
      <thead>
        <tr>
          <th className="h-10 border-b border-l border-dark-4 max-w-sm truncate px-3 bg-dark-3 sticky z-10 top-0 w-px" />
          {fields.map((field, i) => (
            <ColumnTitle key={i} table={table} field={field} index={i} />
          ))}
        </tr>
      </thead>
      <tbody className="bg-darker">
        {rows.map((_, i) => (
          <Row key={i} fields={fields} rowIndex={i} />
        ))}
      </tbody>
    </table>
  );
}
