import React from 'react';
import QueryResult from 'components/Query/QueryResult';
import { TableState } from 'components/Table/table.service';
import { useObserver } from 'mobx-react-lite';

export default function Table({ state: { state } }: { state: TableState }) {
  const { fields, rows } = useObserver(() => ({
    fields: state.fields,
    rows: state.rows,
  }));

  return <QueryResult fields={fields} rows={rows} />;
}
