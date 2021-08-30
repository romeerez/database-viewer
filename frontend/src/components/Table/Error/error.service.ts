import { useMemo } from 'react';
import { useLocalObservable } from 'mobx-react-lite';

export type ErrorService = ReturnType<typeof useErrorService>;

export const useErrorService = () => {
  const store = useLocalObservable(() => ({
    showMainError: true,
    error: undefined as string | undefined,
    setShowMainError(show: boolean) {
      store.showMainError = show;
    },
    setError(error?: string) {
      store.error = error;
    },
  }));

  return useMemo(
    () => ({
      getShowMainError: () => store.showMainError,
      setShowMainError: store.setShowMainError,
      getError: () => store.error,
      setError: store.setError,
    }),
    [store],
  );
};
