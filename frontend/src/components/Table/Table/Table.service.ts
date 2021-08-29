import { RefObject, useMemo } from 'react';

export enum CellType {
  row = 'row',
  column = 'column',
  cell = 'cell',
}

export type Cell =
  | {
      type: CellType.cell;
      row: number;
      column: number;
    }
  | {
      type: CellType.row;
      row: number;
    }
  | {
      type: CellType.column;
      column: number;
    };

export type TableService = ReturnType<typeof useTableService>;

export const useTableService = ({
  tableRef,
}: {
  tableRef: RefObject<HTMLElement>;
}) => {
  return useMemo(
    () => ({
      getColumnProps(column: number) {
        return {
          'data-type': CellType.column,
          'data-column': column,
        };
      },
      getRowProps(row: number) {
        return {
          'data-type': CellType.row,
          'data-row': row,
        };
      },
      getCellProps(row: number, column: number) {
        return {
          'data-type': CellType.cell,
          'data-row': row,
          'data-column': column,
        };
      },
      getCellData(el: HTMLElement): Cell | undefined {
        const { type, row, column } = el.dataset as {
          type: CellType;
          row: string;
          column: string;
        };

        if (type === CellType.row) {
          return {
            type: CellType.row,
            row: parseInt(row),
          };
        } else if (type === CellType.column) {
          return {
            type: CellType.column,
            column: parseInt(column),
          };
        } else if (type === CellType.cell) {
          return {
            type: CellType.cell,
            row: parseInt(row),
            column: parseInt(column),
          };
        }
      },
      getCell(row: number, column: number) {
        return tableRef.current?.querySelector(
          `[data-row='${row}'][data-column='${column}']`,
        ) as HTMLElement | undefined;
      },
    }),
    [tableRef],
  );
};
