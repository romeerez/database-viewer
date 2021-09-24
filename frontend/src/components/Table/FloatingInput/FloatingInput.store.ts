import React from 'react';
import { computed, useCreateStore } from 'jastaman';
import { TableDataService } from '../TableData/tableData.service';
import {
  columnTypeFormatters,
  isDateTime,
  isNumberType,
} from '../columnType.utils';
import { useTextAreaStore } from './Inputs/TextArea.store';
import { useNumberInputStore } from './Inputs/NumberInput.store';
import { useDateTimeInputStore } from './Inputs/DateTimeInput.store';

type BlurTimeout = ReturnType<typeof setTimeout> | undefined;

export type Cell = {
  row: number;
  column: number;
  offsetTop: number;
  offsetLeft: number;
  minWidth: number;
  minHeight: number;
};

type InputStore = {
  state: {
    isRaw: boolean;
  };
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
  init(data: {
    value: string;
    isRaw: boolean;
    type: string;
    default: string | undefined;
    isNullable: boolean | undefined;
  }): void;
  setValue(value: string): void;
  setIsRaw(isRaw: boolean): void;
  getIsValid(): boolean;
  getParsedValue(): string;
};

export const useFloatingInputStore = ({
  tableDataService,
}: {
  tableDataService: TableDataService;
}) => {
  const textAreaStore = useTextAreaStore();
  const numberInputStore = useNumberInputStore();
  const dateTimeInputStore = useDateTimeInputStore();

  const store = useCreateStore(() => ({
    textAreaStore,
    numberInputStore,
    dateTimeInputStore,
    state: {
      tableData: {
        defaults: tableDataService.state.defaults,
        rows: tableDataService.state.rows,
        fields: tableDataService.state.fields,
      },
      initialValue: null as string | null,
      initialIsRaw: false,
      cell: undefined as Cell | undefined,
      preventBlur: false,
      blurTimeout: undefined as BlurTimeout,
      showInputs: false,
      type: '',
      isNumber: computed<boolean>(),
      isDateTime: computed<boolean>(),
      isText: computed<boolean>(),
      inputStore: computed<InputStore>(),
    },
    computed: {
      isNumber: [(state) => [state.type], (state) => isNumberType(state.type)],
      isDateTime: [(state) => [state.type], (state) => isDateTime(state.type)],
      isText: [
        (state) => [state.type, state.isNumber, state.isDateTime],
        (state) => Boolean(state.type && !state.isNumber && !state.isDateTime),
      ],
      inputStore: [
        (state) => [state.isNumber, state.isDateTime],
        (state) => {
          if (state.isNumber) {
            return numberInputStore;
          } else if (state.isDateTime) {
            return dateTimeInputStore;
          } else {
            return textAreaStore;
          }
        },
      ],
    },
    init(cell: Cell, type: string, value: string | null, isRaw: boolean) {
      store.set({ cell, type, initialValue: value, initialIsRaw: isRaw });

      const format = columnTypeFormatters[type];
      const { tableData } = store.state;
      store.state.inputStore.init({
        value: format ? format(value || '') : value || '',
        isRaw,
        type,
        default: tableData.defaults?.[cell.column],
        isNullable: tableData.fields?.[cell.column]?.isNullable,
      });
    },
    setValue(value: string) {
      store.state.inputStore.setValue(value);
    },
    setIsRaw(isRaw: boolean) {
      store.state.inputStore.setIsRaw(isRaw);
    },
    getIsRaw() {
      return store.state.inputStore.state.isRaw;
    },
    getParsedValue() {
      return store.state.inputStore.getParsedValue();
    },
    getIsValid() {
      return store.state.inputStore.getIsValid();
    },
  }));

  tableDataService.useEffect(
    (state) => ({
      defaults: state.defaults,
      rows: state.rows,
      fields: state.fields,
    }),
    (tableData) => {
      store.set({ tableData });
    },
  );

  return store;
};
