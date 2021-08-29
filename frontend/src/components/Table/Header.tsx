import React from 'react';
import Header from '../../components/Common/Header';
import { useTablePageContext } from './TablePage.context';

export default function TableHeader() {
  const { tableDataService } = useTablePageContext();
  const params = tableDataService.getParams();

  return (
    <Header
      breadcrumbs={[
        params.sourceName,
        params.databaseName,
        params.schemaName,
        params.tableName,
      ]}
    />
  );
}
