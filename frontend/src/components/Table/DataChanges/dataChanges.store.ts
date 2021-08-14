import { useLocalObservable } from 'mobx-react-lite';
import { TableDataService } from '../TableData/tableData.service';

export const useDataChangesStore = ({
  tableDataService,
}: {
  tableDataService: TableDataService;
}) => {
  const store = useLocalObservable(() => ({
    removedRows: {} as Record<string, true>,
    changes: {} as Record<string, Record<string, string | null>>,
    newRows: {} as Record<string, true>,
    raw: {} as Record<string, Record<string, true>>,
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
        changes: Object.keys(store.changes[rowIndex]).map((columnIndex) => {
          const index = parseInt(columnIndex);
          return {
            columnName: fields[index].name,
            columnIndex: index,
            isRaw: store.raw[rowIndex]?.[columnIndex] || false,
            value: store.changes[rowIndex][columnIndex],
          };
        }),
      }));
    },
    getNewRows() {
      const rows = tableDataService.getRows();
      if (!rows) return [];

      return Object.keys(store.newRows).map((rowIndex) =>
        rows[parseInt(rowIndex)].map((value, columnIndex) => ({
          value,
          isRaw: store.raw[rowIndex]?.[columnIndex] || false,
        })),
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
    getValue(rowIndex: number, columnIndex: number): string | null {
      const change = store.changes[rowIndex];
      if (change && columnIndex in change) {
        return change[columnIndex];
      }
      return tableDataService.getRows()?.[rowIndex]?.[columnIndex] ?? null;
    },
    getIsRaw(rowIndex: number, columnIndex: number) {
      return store.raw[rowIndex]?.[columnIndex] || false;
    },
    setValue(
      rowIndex: number,
      columnIndex: number,
      value: string | null,
      raw: boolean,
    ) {
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

      store.setRaw(rowIndex, columnIndex, raw);
    },
    setRaw(rowIndex: number, columnIndex: number, raw: boolean) {
      if (raw) {
        if (!store.raw[rowIndex]) store.raw[rowIndex] = {};
        store.raw[rowIndex][columnIndex] = true;
      } else if (store.raw[rowIndex]?.[columnIndex]) {
        delete store.raw[rowIndex]?.[columnIndex];
        if (Object.keys(store.raw[rowIndex]).length === 0) {
          delete store.raw[rowIndex];
        }
      }
    },
  }));

  return store;
};
