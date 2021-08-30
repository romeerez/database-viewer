import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
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

export default function TablePage() {
  const { pathname } = useLocation();

  return <TablePageReMountable key={pathname} />;
}

const TablePageReMountable = () => {
  const tableRef = useRef<HTMLTableElement>(null);
  const tableService = useTableService({ tableRef });
  const errorService = useErrorService();
  const tableDataService = useDataService({ errorService });
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
      }}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <Header />
        <ControlPanel />
        <Conditions />
        <Scrollbars>
          <Selection>
            <FloatingInput>
              <Table />
            </FloatingInput>
          </Selection>
        </Scrollbars>
        <Error isMain />
      </div>
    </TablePageContext.Provider>
  );
};
