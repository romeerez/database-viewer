import { computed, useCreateStore } from 'jastaman';
import { useRef } from 'react';

export const useTextAreaStore = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const store = useCreateStore(() => ({
    inputRef,
    state: {
      value: '',
      isRaw: false,
      default: undefined as string | undefined,
      isNullable: undefined as boolean | undefined,
      placeholder: computed<string>(),
    },
    computed: {
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
      return true;
    },
    getParsedValue() {
      return store.state.value;
    },
  }));

  return store;
};
