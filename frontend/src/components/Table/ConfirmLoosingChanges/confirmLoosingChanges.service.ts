import { useTablePageContext } from '../TablePage.context';
import { useCreateStore } from 'jastaman';
import { useMemo } from 'react';
import { DataChangesService } from '../DataChanges/dataChanges.service';

export type ConfirmLoosingChangesService = ReturnType<
  typeof useConfirmLoosingChangesService
>;

export const useConfirmLoosingChangesService = ({
  dataChangesService,
}: {
  dataChangesService: DataChangesService;
}) => {
  const store = useCreateStore(() => ({
    state: {
      confirmCallback: undefined as (() => void) | undefined,
    },
  }));

  return useMemo(
    () => ({
      ...store,
      confirmLoosingChanges: (fn: () => void) => () => {
        if (!dataChangesService.state.hasChanges) return fn();
        store.set({ confirmCallback: fn });
      },
    }),
    [],
  );
};
