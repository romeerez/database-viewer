import { useMemo } from 'react';
import { useCreateModalsStore } from './modals.store';
import { ServerInLocalStore } from '../../Server/types';

export type ModalsService = ReturnType<typeof useCreateModalsService>;

export const useCreateModalsService = () => {
  const store = useCreateModalsStore();

  return useMemo(
    () => ({
      use: store.use,
      setServerForEdit(value?: ServerInLocalStore) {
        store.set({ serverForEdit: value });
      },
      setServerForDelete(value?: ServerInLocalStore) {
        store.set({ serverForDelete: value });
      },
    }),
    [],
  );
};
