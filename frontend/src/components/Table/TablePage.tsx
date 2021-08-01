import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import ControlPanel from 'components/Table/ControlPanel/ControlPanel';
import Conditions from './Conditions/Conditions';
import Scrollbars from 'components/Common/Scrollbars';
import Table from 'components/Table/Table/Table';
import { useDataService } from 'components/Table/TableData/tableData.service';
import { useSelectionService } from 'components/Table/Selection/selection.service';
import Selection from './Selection/Selection';
import { TablePageContext } from 'components/Table/TablePage.context';
import { useDataChangesService } from 'components/Table/DataChanges/dataChanges.service';
import FloatingInput from 'components/Table/FloatingInput/FloatingInput';
import { useFloatingInputService } from 'components/Table/FloatingInput/FloatingInput.service';

export default function TablePage() {
  const { pathname } = useLocation();

  return <TablePageReMountable key={pathname} />;
}

const TablePageReMountable = () => {
  const tableDataService = useDataService();
  const dataChangesService = useDataChangesService({ tableDataService });
  const selectionService = useSelectionService({
    tableDataService,
    dataChangesService,
  });
  const floatingInputService = useFloatingInputService({
    tableDataService,
    dataChangesService,
    selectionService,
  });

  return (
    <TablePageContext.Provider
      value={{
        tableDataService,
        dataChangesService,
        selectionService,
        floatingInputService,
      }}
    >
      <div className="flex flex-col h-full">
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
      </div>
    </TablePageContext.Provider>
  );
};
