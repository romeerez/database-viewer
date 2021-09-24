import React, { useMemo, useRef } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import Header from './Header';
import ControlPanel from '../../components/Table/ControlPanel/ControlPanel';
import Conditions from './Conditions/Conditions';
import Scrollbars from '../../components/Common/Scrollbars';
import Table from '../../components/Table/Table/Table';
import { useDataService } from './TableData/tableData.service';
import { useSelectionService } from './Selection/selection.service';
import Selection from './Selection/Selection';
import { TablePageContext } from './TablePage.context';
import { useDataChangesService } from './DataChanges/dataChanges.service';
import FloatingInput from '../../components/Table/FloatingInput/FloatingInput';
import { useFloatingInputService } from './FloatingInput/FloatingInput.service';
import { useTableService } from './Table/Table.service';
import { useErrorService } from './Error/error.service';
import Error from './Error/Error';
import { dataSourcesStore } from '../DataSource/dataSource.store';
import { useConditionsService } from './Conditions/Conditions.service';
import ConfirmLoosingChanges from './ConfirmLoosingChanges/ConfirmLoosingChanges';
import { useConfirmLoosingChangesService } from './ConfirmLoosingChanges/confirmLoosingChanges.service';

export type Params = {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  tableName: string;
};

export default function TablePage() {
  const { pathname } = useLocation();

  return <TablePageReMountable key={pathname} />;
}

const TablePageReMountable = () => {
  const { params } = useRouteMatch<Params>();
  const { data: localDataSources } = dataSourcesStore.useDataSources();
  const { sourceName } = params;
  const sourceUrl = useMemo(
    () => localDataSources?.find((source) => source.name === sourceName)?.url,
    [sourceName, localDataSources],
  );

  const tableRef = useRef<HTMLTableElement>(null);
  const tableService = useTableService({ tableRef });
  const errorService = useErrorService();
  const conditionsService = useConditionsService({ params, sourceUrl });
  const tableDataService = useDataService({
    params,
    sourceUrl,
    errorService,
    conditionsService,
  });
  const dataChangesService = useDataChangesService({
    tableDataService,
    errorService,
  });
  const selectionService = useSelectionService({
    tableDataService,
    dataChangesService,
    floatingInputService: () => floatingInputService,
  });
  const floatingInputService = useFloatingInputService({
    tableService,
    tableDataService,
    dataChangesService,
    selectionService,
  });
  const confirmLoosingChangesService = useConfirmLoosingChangesService({
    dataChangesService,
  });

  return (
    <TablePageContext.Provider
      value={{
        tableRef,
        tableService,
        tableDataService,
        dataChangesService,
        selectionService,
        floatingInputService,
        errorService,
        conditionsService,
        confirmLoosingChangesService,
      }}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <Header />
        <ControlPanel />
        <Conditions />
        <Scrollbars>
          <Selection>
            <Table />
          </Selection>
          <FloatingInput />
        </Scrollbars>
        <Error isMain />
        <ConfirmLoosingChanges />
      </div>
    </TablePageContext.Provider>
  );
};
