import React from 'react';
import Table from './Table';
import { useRouteMatch } from 'react-router-dom';
import Header from 'components/Common/Header';
import { useTable } from 'components/Table/table.service';
import Condition from 'components/Table/Condition';

export default function TablePage() {
  const { params } =
    useRouteMatch<{
      sourceName: string;
      databaseName: string;
      schemaName: string;
      tableName: string;
    }>();

  const tableState = useTable({
    ...params,
  });

  return (
    <div className="flex flex-col h-full">
      <Header breadcrumbs={Object.values(params)} />
      <div className="flex w-full">
        {tableState.sourceUrl && (
          <>
            <Condition
              conditionType="where"
              onSubmit={tableState.setWhere}
              sourceUrl={tableState.sourceUrl}
              {...params}
            />
            <Condition
              conditionType="orderBy"
              onSubmit={tableState.setWhere}
              sourceUrl={tableState.sourceUrl}
              {...params}
            />
          </>
        )}
      </div>
      <Table state={tableState} />
    </div>
  );
}
