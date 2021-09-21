import {
  createOpenState,
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from './open.state';
import { DataSourceInLocalStore } from '../DataSource/types';
import { createStore } from 'jastaman';

export const DataTreeState = createStore({
  state: {
    search: '',
    openChangedOnSearch: false,
  },
  setSearch(search: string) {
    DataTreeState.set({ openChangedOnSearch: true, search });
  },
});

export const noSearchOpenState = createOpenState({
  defaultOpen: false,
  items: loadStateFromLocalStorage(),
  onChange(items) {
    DataTreeState.set({ openChangedOnSearch: false });
    saveStateToLocalStorage(items);
  },
});

export const searchOpenState = createOpenState({
  defaultOpen: true,
  onChange() {
    DataTreeState.set({ openChangedOnSearch: false });
  },
});

export const modalsState = createStore({
  state: {
    dataSourceForEdit: undefined as DataSourceInLocalStore | undefined,
    dataSourceForDelete: undefined as DataSourceInLocalStore | undefined,
  },
  setDataSourceForEdit(value?: DataSourceInLocalStore) {
    modalsState.set({ dataSourceForEdit: value });
  },
  setDataSourceForDelete(value?: DataSourceInLocalStore) {
    modalsState.set({ dataSourceForDelete: value });
  },
});
