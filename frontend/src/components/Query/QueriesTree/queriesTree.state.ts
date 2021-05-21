import { makeAutoObservable } from 'mobx';

export const SearchState = makeAutoObservable({
  search: '',
  setSearch(value: string) {
    this.search = value;
  },
});
