import { useCreateStore } from 'jastaman';
import { ServerInLocalStore } from '../../Server/types';

export const useCreateModalsStore = () => {
  return useCreateStore(() => ({
    state: {
      serverForEdit: undefined as ServerInLocalStore | undefined,
      serverForDelete: undefined as ServerInLocalStore | undefined,
    },
  }));
};
