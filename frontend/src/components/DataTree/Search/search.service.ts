import { useCreateSearchStore } from './search.store';
import { DependencyList, useMemo } from 'react';

export type SearchService = ReturnType<typeof useCreateSearchService>;

export const useCreateSearchService = () => {
  const store = useCreateSearchStore();

  return useMemo(
    () => ({
      getSearch() {
        return store.state.search;
      },
      useSearch() {
        return store.use('search');
      },
      useLowerSearch() {
        return store.use('lowerSearch');
      },
      useOnSearchChange(
        callback: (search: string) => void,
        deps?: DependencyList,
      ) {
        store.useEffect((state) => state.search, callback, deps);
      },
      setSearch(search: string) {
        store.set({ search });
      },
    }),
    [],
  );
};
