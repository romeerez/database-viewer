import React from 'react';
import { DataStore } from 'components/Table/data.store';
import { DataService } from 'components/Table/data.service';
import { observer } from 'mobx-react-lite';
import cn from 'classnames';

export default observer(function Row({
  store,
  service,
  row,
  index,
}: {
  store: DataStore;
  service: DataService;
  row: (string | null)[];
  index: number;
}) {
  const { defaults, fields, newRows } = store;
  if (!defaults || !fields) return null;

  const isNew = newRows[index];

  return (
    <tr>
      <td
        className={cn(
          'h-10 border-b border-l border-dark-4 max-w-sm truncate px-3 sticky -left-px w-px',
          isNew ? 'bg-green-1' : 'bg-dark-3',
        )}
      >
        {index + 1}
      </td>
      {row.map((value, i) => (
        <td
          data-bg-class={isNew ? 'bg-green-2' : 'bg-dark-3'}
          data-row-index={index}
          data-column-index={i}
          tabIndex={0}
          key={i}
          className={cn(
            'h-10 border-b border-l border-dark-4 max-w-sm truncate px-4',
            isNew ? 'bg-green-2' : 'px-4',
            value === null && 'text-light-9',
          )}
        >
          {value === null ? defaults[i] || 'null' : value}
        </td>
      ))}
    </tr>
  );
});
