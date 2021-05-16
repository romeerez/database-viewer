import React from 'react';
import Editor from 'components/Editor/Editor';
import Table from './Table';
import { useRouteMatch } from 'react-router-dom';
import { dataSourcesStore } from 'components/DataSource/dataSource.store';
import { useObserver } from 'mobx-react-lite';

export default function TablePage() {
  const {
    params: { sourceName, databaseName, schemaName, tableName },
  } =
    useRouteMatch<{
      sourceName: string;
      databaseName: string;
      schemaName: string;
      tableName: string;
    }>();

  const localDataSources = useObserver(() => dataSourcesStore.dataSources);

  const source = localDataSources?.find((source) => source.name === sourceName);

  return (
    <div className="flex flex-col h-full">
      <Editor
        source={source}
        databaseName={databaseName}
        schemaName={schemaName}
      />
      <Table
        source={source}
        databaseName={databaseName}
        schemaName={schemaName}
        tableName={tableName}
      />
    </div>
  );
}
