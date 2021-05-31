import { RowsState } from 'components/Table/rows.state';
import { action } from 'mobx';
import { DataState } from 'components/Table/data.state';
import { RefObject } from 'react';
import Scroll from 'react-custom-scrollbars';

export const addRow = action(
  (
    rowsState: RowsState,
    dataState: DataState,
    scrollRef: RefObject<Scroll>,
  ) => {
    const { fields, rows } = dataState;
    if (!fields || !rows) return;
    rowsState.newRowIndices[rows.length + rowsState.newRows.length] = true;
    rowsState.newRows.push(fields.map(() => null));

    setTimeout(() => scrollRef.current?.scrollToBottom());
  },
);

export const isNewRow = (rowsState: RowsState, index: number) =>
  rowsState.newRowIndices[index] || false;
