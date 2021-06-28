import React, { useRef } from 'react';
import { DataStore } from 'components/Table/data.store';
import { DataService } from 'components/Table/data.service';
import { observer } from 'mobx-react-lite';
import Scrollbars from 'components/Common/Scrollbars';
import Row from './Row';
import Inputs from './Inputs';

export default observer(function Table({
  store,
  service,
}: {
  store: DataStore;
  service: DataService;
}) {
  const tableRef = useRef<HTMLTableElement>(null);

  const { fields, rows } = store;
  if (!fields || !rows) return null;

  return (
    <Scrollbars>
      <table
        ref={tableRef}
        className="border-r border-dark-4 text-sm text-left"
      >
        <thead>
          <tr>
            <th className="h-10 border-b border-l border-dark-4 max-w-sm truncate px-3 bg-dark-3 sticky z-10 top-0 w-px" />
            {fields.map((field) => (
              <th
                key={field.name}
                className="h-10 border-b border-l border-dark-4 max-w-sm truncate px-4 bg-dark-3 sticky z-10 top-0"
              >
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-darker">
          {rows.map((row, i) => (
            <Row key={i} store={store} service={service} row={row} index={i} />
          ))}
        </tbody>
      </table>
      <Inputs store={store} service={service} tableRef={tableRef} />
    </Scrollbars>
  );
});
