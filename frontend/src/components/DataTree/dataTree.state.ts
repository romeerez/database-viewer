import { makeAutoObservable } from 'mobx';
import {
  createOpenState,
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from 'components/DataTree/open.state';

export const DataTreeState = makeAutoObservable({
  search: '',
  openChangedOnSearch: false,
  setSearch(search: string) {
    this.openChangedOnSearch = true;
    this.search = search;
  },
});

export const noSearchOpenState = createOpenState({
  defaultOpen: false,
  items: loadStateFromLocalStorage(),
  onChange(items) {
    DataTreeState.openChangedOnSearch = false;
    saveStateToLocalStorage(items);
  },
});

export const searchOpenState = createOpenState({
  defaultOpen: true,
  onChange() {
    DataTreeState.openChangedOnSearch = false;
  },
});
