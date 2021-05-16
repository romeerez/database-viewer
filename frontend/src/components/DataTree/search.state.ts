import { makeAutoObservable } from 'mobx';

export const SearchState = makeAutoObservable({
  search: '',
  setSearch(search: string) {
    this.search = search;
  },
});
