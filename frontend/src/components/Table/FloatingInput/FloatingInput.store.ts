import React, { useRef } from 'react';
import { computed, useCreateStore } from 'jastaman';
import { TableDataService } from '../TableData/tableData.service';
import { isInteger, isNumberType } from '../columnType.utils';

type BlurTimeout = ReturnType<typeof setTimeout> | undefined;

export type Cell = {
  row: number;
  column: number;
  offsetTop: number;
  offsetLeft: number;
  minWidth: number;
  minHeight: number;
  className: string;
  type: string;
};

export const useFloatingInputStore = ({
  tableDataService,
}: {
  tableDataService: TableDataService;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const store = useCreateStore(() => ({
    state: {
      cell: undefined as Cell | undefined,
      value: null as string | null,
      isRaw: false,
      preventBlur: false,
      blurTimeout: undefined as BlurTimeout,
      showInputs: false,
      defaults: tableDataService.state.defaults,
      fields: tableDataService.state.fields,
      isNumber: computed<boolean>(),
      isInteger: computed<boolean>(),
      inputRef: computed<React.RefObject<HTMLElement>>(),
    },
    computed: {
      isNumber: [
        (state) => [state.cell?.type],
        (state) => isNumberType(state.cell?.type || ''),
      ],
      isInteger: [
        (state) => [state.isNumber],
        (state) => state.isNumber && isInteger(state.cell?.type || ''),
      ],
      inputRef: [
        (state) => [state.isNumber],
        (state) => {
          if (state.isNumber) {
            return numberInputRef;
          } else {
            return textAreaRef;
          }
        },
      ],
    },
    textAreaRef,
    numberInputRef,
    setCell(cell?: Cell) {
      store.set({ cell });
    },
    setIsRaw(isRaw: boolean) {
      store.set({ isRaw });
    },
    setValue(value: string | null) {
      store.set({ value });
    },
  }));

  tableDataService.useEffect(
    (state) => ({ defaults: state.defaults, fields: state.fields }),
    (slice) => {
      store.set(slice);
    },
  );

  return store;
};
