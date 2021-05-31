import React, { useRef } from 'react';
import Table from './Table';
import Header from 'components/Common/Header';
import Condition from 'components/Table/Condition';
import ControlPanel from 'components/Table/ControlPanel';
import { useFieldsInfo } from 'components/Table/fieldsInfo.service';
import { useRowsState } from 'components/Table/rows.state';
import { useParamsState } from 'components/Table/params.service';
import { useDataState } from 'components/Table/data.state';
import {
  setOrderBy,
  setWhere,
  useLoadData,
  useLoadInitialData,
} from 'components/Table/data.service';
import Scrollbars from 'react-custom-scrollbars';

export default function TablePage() {
  const paramsState = useParamsState();
  const dataState = useDataState();

  const fieldsInfo = useFieldsInfo({
    paramsState,
    dataState,
  });

  useLoadInitialData({ dataState, paramsState });

  const load = useLoadData({ dataState, paramsState });

  const rowsState = useRowsState({ dataState });

  const scrollRef = useRef<Scrollbars>(null);

  return (
    <div className="flex flex-col h-full">
      <Header
        breadcrumbs={[
          paramsState.sourceName,
          paramsState.databaseName,
          paramsState.schemaName,
          paramsState.tableName,
        ]}
      />
      <div className="flex w-full border-b border-dark-4">
        <ControlPanel
          dataState={dataState}
          rowsState={rowsState}
          load={load}
          scrollRef={scrollRef}
        />
      </div>
      <div className="flex w-full">
        <Condition
          conditionType="where"
          onSubmit={(where) => setWhere(dataState, load, where)}
          paramsState={paramsState}
        />
        <Condition
          conditionType="orderBy"
          onSubmit={(orderBy) => setOrderBy(dataState, load, orderBy)}
          paramsState={paramsState}
        />
      </div>
      <Table
        dataState={dataState}
        rowsState={rowsState}
        scrollRef={scrollRef}
        fieldsInfo={fieldsInfo}
      />
    </div>
  );
}
