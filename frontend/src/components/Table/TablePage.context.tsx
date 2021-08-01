import { createContext, useContext } from 'react';
import { SelectionService } from 'components/Table/Selection/selection.service';
import { TableDataService } from 'components/Table/TableData/tableData.service';
import { DataChangesService } from 'components/Table/DataChanges/dataChanges.service';
import { FloatingInputService } from 'components/Table/FloatingInput/FloatingInput.service';

export type TablePageContextValues = {
  tableDataService: TableDataService;
  dataChangesService: DataChangesService;
  selectionService: SelectionService;
  floatingInputService: FloatingInputService;
};

export const TablePageContext = createContext({} as TablePageContextValues);

export const useTablePageContext = () => useContext(TablePageContext);
