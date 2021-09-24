import { TableDataService } from '../TableData/tableData.service';
import { computed, useCreateStore } from 'jastaman';
import { QueryResult } from 'types';
import { useEffect } from 'react';

type RowChange = {
  row: QueryResult['rows'][number];
  changes: {
    columnName: string;
    columnIndex: number;
    isRaw: boolean;
    value: string | null;
  }[];
};

type NewRow = {
  value: string | null;
  isRaw: boolean;
}[];

export const useDataChangesStore = ({
  tableDataService,
}: {
  tableDataService: TableDataService;
}) => {
  const store = useCreateStore(() => ({
    state: {
      removedRowsMap: {} as Record<string, true>,
      changesMap: {} as Record<string, Record<string, string | null>>,
      newRowsMap: {} as Record<string, true>,
      rawMap: {} as Record<string, Record<string, true>>,
      isLoading: false,
      rows: tableDataService.state.rows,
      fields: tableDataService.state.fields,
      hasChanges: computed<boolean>(),
      removedRows: computed<QueryResult['rows']>(),
      rowChanges: computed<RowChange[]>(),
      newRows: computed<NewRow[]>(),
    },
    computed: {
      hasChanges: [
        (state) => [state.removedRowsMap, state.changesMap, state.newRowsMap],
        (state) =>
          Object.keys(state.removedRowsMap).length > 0 ||
          Object.keys(state.changesMap).length > 0 ||
          Object.keys(state.newRowsMap).length > 0,
      ],
      removedRows: [
        (state) => [state.rows, state.removedRowsMap],
        (state) => state.rows?.filter((_, i) => state.removedRowsMap[i]) || [],
      ],
      rowChanges: [
        (state) => [state.rows, state.fields, state.rawMap, state.changesMap],
        ({ rows, fields, rawMap, changesMap }) => {
          if (!rows || !fields) return [];

          return Object.keys(changesMap).map((rowIndex) => ({
            row: rows[parseInt(rowIndex)],
            changes: Object.keys(changesMap[rowIndex]).map((columnIndex) => {
              const index = parseInt(columnIndex);
              return {
                columnName: fields[index].name,
                columnIndex: index,
                isRaw: rawMap[rowIndex]?.[columnIndex] || false,
                value: changesMap[rowIndex][columnIndex],
              };
            }),
          }));
        },
      ],
      newRows: [
        (state) => [state.rows, state.newRowsMap, state.rawMap],
        ({ rows, newRowsMap, rawMap }) => {
          if (!rows) return [];

          return Object.keys(newRowsMap).map((rowIndex) =>
            rows[parseInt(rowIndex)].map((value, columnIndex) => ({
              value,
              isRaw: rawMap[rowIndex]?.[columnIndex] || false,
            })),
          );
        },
      ],
    },
    setIsLoading(isLoading: boolean) {
      store.set({ isLoading });
    },
    reset() {
      store.set({
        removedRowsMap: {},
        changesMap: {},
        newRowsMap: {},
        rawMap: {},
        isLoading: false,
      });
    },
    setNewRow(index: number) {
      store.set((state) => ({
        newRowsMap: { ...state.newRowsMap, [index]: true },
      }));
    },
    addRow(row: string[]) {
      tableDataService.addRow(row);
    },
    removeRows(stringIndices: string[]) {
      let { newRowsMap } = store.state;
      if (stringIndices.some((row) => newRowsMap[row])) {
        const { rows } = tableDataService.state;
        if (!rows) return;

        newRowsMap = { ...newRowsMap };
        stringIndices.forEach((row) => delete newRowsMap[row]);
        store.set({ newRowsMap });

        const numberIndices = stringIndices.map((row) => parseInt(row));
        tableDataService.setRows(
          rows.filter((_, i) => !numberIndices.includes(i)),
        );
      }

      const removedRowsMap = { ...store.state.removedRowsMap };
      stringIndices.forEach((row) => {
        removedRowsMap[row] = true;
      });
      store.set({ removedRowsMap });
    },
    unmarkRemovedRows(rows: string[]) {
      const map = { ...store.state.removedRowsMap };
      rows.forEach((row) => delete map[row]);
      store.set({ removedRowsMap: map });
    },
    undoChanges(change: Record<string, string[]>) {
      const changesMap = { ...store.state.changesMap };
      const rawMap = { ...store.state.rawMap };

      for (const row in change) {
        if (!changesMap[row]) {
          continue;
        }

        const rowChanges = { ...changesMap[row] };
        const rowRaw = { ...rawMap[row] };
        change[row].forEach((column) => {
          if (rowChanges?.[column]) {
            delete rowChanges[column];
          }
          if (rowRaw[column]) {
            delete rowRaw[column];
          }
        });

        if (Object.keys(rowChanges).length === 0) {
          delete changesMap[row];
        } else {
          changesMap[row] = rowChanges;
        }

        if (Object.keys(rowRaw).length === 0) {
          delete rawMap[row];
        } else {
          rawMap[row] = rowRaw;
        }
      }

      store.set({ changesMap, rawMap });
    },
    getValue(rowIndex: number, columnIndex: number): string | null {
      const change = store.state.changesMap[rowIndex];
      if (change && columnIndex in change) {
        return change[columnIndex];
      }
      return store.state.rows?.[rowIndex]?.[columnIndex] ?? null;
    },
    getIsRaw(rowIndex: number, columnIndex: number): boolean {
      return store.state.rawMap[rowIndex]?.[columnIndex] || false;
    },
    useValue(rowIndex: number, columnIndex: number): string | null {
      return store.use(
        () => store.getValue(rowIndex, columnIndex),
        [rowIndex, columnIndex],
      );
    },
    useIsRaw(rowIndex: number, columnIndex: number) {
      return store.use(
        (state) => state.rawMap[rowIndex]?.[columnIndex] || false,
      );
    },
    setValue(
      rowIndex: number,
      columnIndex: number,
      value: string | null,
      raw: boolean,
    ) {
      const { rows } = store.state;
      const row = rows?.[rowIndex];
      if (!rows || !row) return;

      if (store.state.newRowsMap[rowIndex]) {
        store.set({
          rows: rows.map((row, i) =>
            i === rowIndex
              ? row.map((column, i) => (i === columnIndex ? value : column))
              : row,
          ),
        });
      } else if (value === row[columnIndex]) {
        if (store.state.changesMap[rowIndex]) {
          const changesMap = { ...store.state.changesMap };
          const rowChanges = { ...changesMap[rowIndex] };
          changesMap[rowIndex] = rowChanges;
          delete rowChanges[columnIndex];
          if (Object.keys(rowChanges).length === 0) {
            delete changesMap[rowIndex];
          }
          store.set({ changesMap });
        }
      } else {
        const changesMap = { ...store.state.changesMap };
        changesMap[rowIndex] = { ...(changesMap[rowIndex] || {}) };
        changesMap[rowIndex][columnIndex] = value;
        store.set({ changesMap });
      }

      store.setRaw(rowIndex, columnIndex, raw);
    },
    setRaw(rowIndex: number, columnIndex: number, raw: boolean) {
      let { rawMap } = store.state;
      if (raw) {
        rawMap = { ...rawMap };
        rawMap[rowIndex] = { ...(rawMap[rowIndex] || {}) };
        rawMap[rowIndex][columnIndex] = true;
        store.set({ rawMap });
      } else if (rawMap[rowIndex]?.[columnIndex]) {
        rawMap = { ...rawMap, [rowIndex]: { ...rawMap[rowIndex] } };
        delete rawMap[rowIndex][columnIndex];
        if (Object.keys(rawMap[rowIndex]).length === 0) {
          delete rawMap[rowIndex];
        }
        store.set({ rawMap });
      }
    },
  }));

  useEffect(
    () =>
      tableDataService.subscribe(
        (state) => ({ rows: state.rows, fields: state.fields }),
        (slice) => store.set(slice),
      ),
    [],
  );

  return store;
};
