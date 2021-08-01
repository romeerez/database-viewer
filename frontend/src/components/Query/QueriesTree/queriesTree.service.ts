import { useObserver } from 'mobx-react-lite';
import { SearchState } from './queriesTree.state';
import { queriesStore } from '../../../components/Query/queries.store';

export const useSearch = () => {
  const search = useObserver(() => SearchState.search);

  return [search, (value: string) => SearchState.setSearch(value)] as const;
};

export const useFilteredQueries = () => {
  const queries = useObserver(() => queriesStore.queries);
  const search = useObserver(() => SearchState.search);

  if (!search) return queries;

  return queries?.filter((query) =>
    query.name.toLocaleLowerCase().includes(search),
  );
};
