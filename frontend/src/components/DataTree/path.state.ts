import { makeAutoObservable, toJS } from 'mobx';

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

export const PathState = makeAutoObservable({
  path,
  setPath(path: string[]) {
    this.path = path;
    window.localStorage.setItem(
      localStorageKey,
      JSON.stringify(toJS(this.path)),
    );
  },
});
