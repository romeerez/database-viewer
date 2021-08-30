import { createContext, RefObject, useContext } from 'react';
import { SelectionService } from './Selection/selection.service';
import { TableDataService } from './TableData/tableData.service';
import { DataChangesService } from './DataChanges/dataChanges.service';
import { FloatingInputService } from './FloatingInput/FloatingInput.service';
import { TableService } from './Table/Table.service';
import { ErrorService } from './Error/error.service';

export type TablePageContextValues = {
  tableRef: RefObject<HTMLTableElement>;
  tableService: TableService;
  tableDataService: TableDataService;
  dataChangesService: DataChangesService;
  selectionService: SelectionService;
  floatingInputService: FloatingInputService;
  errorService: ErrorService;
};

export const TablePageContext = createContext({} as TablePageContextValues);

export const useTablePageContext = () => useContext(TablePageContext);
