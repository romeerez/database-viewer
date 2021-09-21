import { SearchState } from './queriesTree.state';
import { queriesStore } from '../queries.store';

export const useSearch = () => {
  const search = SearchState.use('search');

  return [search, (value: string) => SearchState.setSearch(value)] as const;
};

export const useFilteredQueries = () => {
  const { data: queries } = queriesStore.useQueries();
  const search = SearchState.use('search');

  if (!search) return queries;

  return queries?.filter((query) =>
    query.name.toLocaleLowerCase().includes(search),
  );
};
