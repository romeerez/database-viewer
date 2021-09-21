import { useCreateStore } from 'jastaman';

export type ErrorService = ReturnType<typeof useErrorService>;

export const useErrorService = () => {
  const store = useCreateStore(() => ({
    state: {
      showMainError: true,
      error: undefined as string | undefined,
    },
    setShowMainError(show: boolean) {
      store.set({ showMainError: show });
    },
    setError(error?: string) {
      store.set({ error });
    },
  }));

  return store;
};
