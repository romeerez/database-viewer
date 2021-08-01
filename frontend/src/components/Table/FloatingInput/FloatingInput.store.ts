import { useLocalObservable } from 'mobx-react-lite';

type BlurTimeout = ReturnType<typeof setTimeout> | undefined;

export type Cell = {
  row: number;
  column: number;
  offsetTop: number;
  offsetLeft: number;
  minWidth: number;
  minHeight: number;
  className: string;
  prevElement?: HTMLElement;
  nextElement?: HTMLElement;
};

export const useFloatingInputStore = () => {
  const store = useLocalObservable(() => ({
    cell: undefined as Cell | undefined,
    value: '',
    isEmptyAllowed: true,
    preventBlur: false,
    blurTimeout: undefined as BlurTimeout,
    showInputs: false,
    setCell(cell: Cell) {
      store.cell = cell;
    },
    setIsEmptyAllowed(value: boolean) {
      store.isEmptyAllowed = value;
    },
    setValue(value: string) {
      store.value = value;
    },
    setPreventBlur(value: boolean) {
      store.preventBlur = value;
    },
    setBlurTimeout(timeout: BlurTimeout) {
      store.blurTimeout = timeout;
    },
    setShowInputs(value: boolean) {
      store.showInputs = value;
    },
  }));

  return store;
};
