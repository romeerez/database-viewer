import { createStore } from 'jastaman';

export const SearchState = createStore({
  state: {
    search: '',
  },
  setSearch(search: string) {
    SearchState.set({ search });
  },
});
