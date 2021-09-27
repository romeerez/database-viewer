import { computed, useCreateStore } from 'jastaman';
import { useRef } from 'react';

export const useBooleanInputStore = () => {
  const inputRef = useRef<HTMLLabelElement>(null);

  const store = useCreateStore(() => ({
    inputRef,
    state: {
      value: '',
      isRaw: false,
      type: '',
      default: undefined as string | undefined,
      isNullable: undefined as boolean | undefined,
      isValid: computed<boolean>(),
      placeholder: computed<string>(),
    },
    computed: {
      isValid: [
        (state) => [state.value, state.isRaw],
        ({ isRaw, value }) => {
          return isRaw ? true : value === 'true' || value === 'false';
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
