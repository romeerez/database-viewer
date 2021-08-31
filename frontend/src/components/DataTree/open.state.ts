import { makeAutoObservable, toJS } from 'mobx';

type OpenState = Record<
  string,
  {
    open: boolean;
    items: OpenState;
  }
>;

const localStorageKey = 'dataTree.openState';
export const loadStateFromLocalStorage = (): OpenState => {
  let items: OpenState = {};

  try {
    const json = window.localStorage.getItem(localStorageKey);
    if (json) items = JSON.parse(json);
    ensureParsedType(items);
  } catch (_) {
    // noop
  }

  return items;
};

const ensureParsedType = (items: OpenState) => {
  for (const name in items) {
    const obj = items[name];
    if (typeof obj.open !== 'boolean') obj.open = false;
    if (typeof obj.items !== 'object') obj.items = {};
    ensureParsedType(obj.items);
  }
};

export const saveStateToLocalStorage = (items: OpenState) => {
  window.localStorage.setItem(localStorageKey, JSON.stringify(toJS(items)));
};

export const createOpenState = ({
  defaultOpen,
  items = {},
  onChange,
}: {
  defaultOpen: boolean;
  items?: OpenState;
  onChange?: (items: OpenState) => void;
}) =>
  makeAutoObservable({
    items,
    reset() {
      this.items = {};
    },
    getItem(...names: string[]) {
      let { items } = this;
      let item: OpenState[string] | undefined;
      for (const name of names) {
        item = items[name];
        if (!item) break;
        items = item.items;
      }

      return item?.open ?? defaultOpen;
    },
    setItem(open: boolean, ...names: string[]) {
      let { items } = this;
      let item: OpenState[string] | undefined;
      for (const name of names) {
        if (!items[name]) items[name] = { open: true, items: {} };
        item = items[name];
        items = item.items;
      }
      if (item) item.open = open;
      if (onChange) onChange(this.items);
    },
  });
