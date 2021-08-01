import { makeAutoObservable } from 'mobx';
import {
  createOpenState,
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from '../../components/DataTree/open.state';
import { DataSourceInLocalStore } from '../../components/DataSource/types';

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

export const modalsState = makeAutoObservable({
  dataSourceForEdit: undefined as DataSourceInLocalStore | undefined,
  setDataSourceForEdit(value?: DataSourceInLocalStore) {
    this.dataSourceForEdit = value;
  },
  dataSourceForDelete: undefined as DataSourceInLocalStore | undefined,
  setDataSourceForDelete(value?: DataSourceInLocalStore) {
    this.dataSourceForDelete = value;
  },
});
