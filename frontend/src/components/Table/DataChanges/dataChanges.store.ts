import { useLocalObservable } from 'mobx-react-lite';
import { TableDataService } from 'components/Table/TableData/tableData.service';

export type DataChangesStore = ReturnType<typeof useDataChangesStore>;

export const useDataChangesStore = ({
  tableDataService,
}: {
  tableDataService: TableDataService;
}) => {
  const store = useLocalObservable(() => ({
    removedRows: {} as Record<string, true>,
    changes: {} as Record<string, Record<string, string | null>>,
    newRows: {} as Record<string, true>,
    getRemovedRows() {
      return (
        tableDataService.getRows()?.filter((_, i) => store.removedRows[i]) || []
      );
    },
    getRowChanges() {
      const rows = tableDataService.getRows();
      const fields = tableDataService.getFields();
      if (!rows || !fields) return [];

      return Object.keys(store.changes).map((rowIndex) => ({
        row: rows[parseInt(rowIndex)],
        changes: Object.keys(store.changes[rowIndex]).map((columnIndex) => ({
          columnName: fields[parseInt(columnIndex)],
          value: store.changes[rowIndex][columnIndex],
        })),
      }));
    },
    getNewRows() {
      const rows = tableDataService.getRows();
      if (!rows) return [];

      return Object.keys(store.newRows).map(
        (rowIndex) => rows[parseInt(rowIndex)],
      );
    },
    setNewRow(index: number) {
      store.newRows[index] = true;
    },
    addRow(row: string[]) {
      tableDataService.getRows()?.push(row);
    },
    removeRows(rows: string[]) {
      rows.forEach((indexString) => {
        if (store.newRows[indexString]) {
          const index = parseInt(indexString);
          const rows = tableDataService.getRows();
          if (!rows) return;

          tableDataService.setRows(rows.filter((_, i) => i !== index));
          delete store.newRows[rows.length];
        } else {
          store.removedRows[indexString] = true;
        }
      });
    },
    getValue(rowIndex: number, columnIndex: number) {
      const change = store.changes[rowIndex];
      if (change && columnIndex in change) {
        return change[columnIndex];
      }
      return tableDataService.getRows()?.[rowIndex]?.[columnIndex];
    },
    setValue(rowIndex: number, columnIndex: number, value: string | null) {
      const row = tableDataService.getRows()?.[rowIndex];
      if (!row) return;

      if (store.newRows[rowIndex]) {
        row[columnIndex] = value;
      } else if (value === row[columnIndex]) {
        const change = store.changes[rowIndex];
        if (change) {
          delete change[columnIndex];
          if (Object.keys(change).length === 0) {
            delete store.changes[rowIndex];
          }
        }
      } else {
        const change = store.changes[rowIndex];
        if (change) {
          change[columnIndex] = value;
        } else {
          store.changes[rowIndex] = { [columnIndex]: value };
        }
      }
    },
  }));

  return store;
};
