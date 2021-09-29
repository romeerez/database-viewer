import {
  createOpenState,
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from './open.state';
import { ServerInLocalStore } from '../Server/types';
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
    serverForEdit: undefined as ServerInLocalStore | undefined,
    serverForDelete: undefined as ServerInLocalStore | undefined,
  },
  setServerForEdit(value?: ServerInLocalStore) {
    modalsState.set({ serverForEdit: value });
  },
  setServerForDelete(value?: ServerInLocalStore) {
    modalsState.set({ serverForDelete: value });
  },
});
