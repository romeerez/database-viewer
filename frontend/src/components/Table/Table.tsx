import React from 'react';
import {
  useTableData,
  UseTableDataProps,
} from 'components/Table/tablePage.service';
import QueryResult from 'components/Query/QueryResult';
import { QueryFieldsAndRowsQuery } from 'generated/graphql';

export default function Table({
  queryFromEditor,
  data,
  useProvidedData,
  ...useTableDataProps
}: {
  queryFromEditor: boolean;
  data?: QueryFieldsAndRowsQuery;
  useProvidedData?: boolean;
} & UseTableDataProps) {
  const { fields, rows, fetchNext } = useTableData(useTableDataProps);

  return (
    <QueryResult
      fields={useProvidedData ? data?.executeQuery.fields : fields}
      rows={useProvidedData ? data?.executeQuery.rows : rows}
      fetchNext={queryFromEditor ? undefined : fetchNext}
    />
  );
}
