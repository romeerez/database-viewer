import { createStore } from 'jastaman';

let path: string[] = [];
const localStorageKey = 'dataTree.path';
const json = window.localStorage.getItem(localStorageKey);
if (json) {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) path = parsed;
  } catch (_) {
    // noop
  }
}

export const PathState = createStore({
  state: {
    path,
  },
  setPath(path: string[]) {
    PathState.set({ path });
    window.localStorage.setItem(localStorageKey, JSON.stringify(path));
  },
});
