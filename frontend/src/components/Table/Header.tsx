import React from 'react';
import Header from 'components/Common/Header';
import { DataStore } from 'components/Table/data.store';

export default function TableHeader({
  store: { params },
}: {
  store: DataStore;
}) {
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
