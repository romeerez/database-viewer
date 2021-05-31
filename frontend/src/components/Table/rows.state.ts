import { useLocalObservable } from 'mobx-react-lite';
import { makeAutoObservable } from 'mobx';
import { DataState } from 'components/Table/data.state';
import { QueryResult } from 'generated/graphql';

export type RowsState = ReturnType<typeof useRowsState>;
export type Row = QueryResult['rows'][number];

export const useRowsState = ({ dataState }: { dataState: DataState }) =>
  useLocalObservable(() =>
    makeAutoObservable({
      newRowIndices: {} as Record<number, boolean>,
      newRows: [] as QueryResult['rows'],
      get rows() {
        if (!dataState.rows) return;

        return [...dataState.rows, ...this.newRows];
      },
    }),
  );
