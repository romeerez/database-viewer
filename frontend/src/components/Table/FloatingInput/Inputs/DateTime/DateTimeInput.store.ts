import { computed, useCreateStore } from 'jastaman';
import { useRef } from 'react';
import { isDate, isTime, isTimestamp } from '../../../columnType.utils';
import dayjs from 'dayjs';

export const useDateTimeInputStore = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const store = useCreateStore(() => ({
    inputRef,
    state: {
      value: '',
      isRaw: false,
      type: '',
      default: undefined as string | undefined,
      isNullable: undefined as boolean | undefined,
      isTimestamp: computed<boolean>(),
      isDate: computed<boolean>(),
      isTime: computed<boolean>(),
      isValid: computed<boolean>(),
      placeholder: computed<string>(),
    },
    computed: {
      isTimestamp: [
        (state) => [state.type],
        (state) => isTimestamp(state.type),
      ],
      isDate: [(state) => [state.type], (state) => isDate(state.type)],
      isTime: [(state) => [state.type], (state) => isTime(state.type)],
      isValid: [
        (state) => [
          state.value,
          state.isRaw,
          state.isTimestamp,
          state.isDate,
          state.isTime,
        ],
        (state) => {
          if (state.isRaw) {
            return true;
          } else if (state.isTimestamp) {
            return !isNaN(dayjs(state.value).valueOf());
          } else {
            return true;
          }
        },
      ],
      placeholder: [
        (state) => [state.value, state.isRaw, state.default, state.isNullable],
        (state) => {
          return state.value === null || state.isRaw
            ? state.default || (!state.isNullable ? 'required' : 'null')
            : 'empty';
        },
      ],
    },
    init(data: {
      value: string;
      isRaw: boolean;
      type: string;
      default: string | undefined;
      isNullable: boolean | undefined;
    }) {
      store.set(data);
    },
    setValue(value: string) {
      store.set({ value });
    },
    setIsRaw(isRaw: boolean) {
      store.set({ isRaw });
    },
    getIsValid() {
      return store.state.isValid;
    },
    getParsedValue() {
      return store.state.value;
    },
  }));

  return store;
};
