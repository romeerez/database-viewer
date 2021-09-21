import { useCreateStore } from 'jastaman';
import { TableDataService } from '../TableData/tableData.service';

type BlurTimeout = ReturnType<typeof setTimeout> | undefined;

export type Cell = {
  row: number;
  column: number;
  offsetTop: number;
  offsetLeft: number;
  minWidth: number;
  minHeight: number;
  className: string;
};

export const useFloatingInputStore = ({
  tableDataService,
}: {
  tableDataService: TableDataService;
}) => {
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
    },
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
