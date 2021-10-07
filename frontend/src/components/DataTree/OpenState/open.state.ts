import { useCreateStore } from 'jastaman';

export type OpenState = Record<
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

export const useCreateOpenState = () => {
  const store = useCreateStore(() => ({
    state: {
      localStorageItems: loadStateFromLocalStorage(),
      items: {} as OpenState,
      animateClose: true,
    },
    setAnimateClose(animateClose: boolean) {
      store.set({ animateClose });
    },
    setItems(items: OpenState) {
      store.set({ items });
    },
    setItemsFromLocalStorage() {
      store.set((state) => ({ items: state.localStorageItems }));
    },
    useIsItemOpen(...names: string[]) {
      return store.use(
        ({ items }) => {
          let item: OpenState[string] | undefined;
          for (const name of names) {
            item = items[name];
            if (!item) break;
            items = item.items;
          }

          return item?.open;
        },
        [names],
      );
    },
    setIsItemOpen(open: boolean, ...names: string[]) {
      const tree = { ...store.state.items };
      let items = tree;
      let item: OpenState[string] | undefined;
      for (const name of names) {
        if (items[name]) {
          items[name] = { ...items[name], items: { ...items[name].items } };
        } else {
          items[name] = { open: true, items: {} };
        }
        item = items[name];
        items = item.items;
      }
      if (item) item.open = open;
      store.set({ items: tree });
    },
    saveStateToLocalStorage() {
      const { items } = store.state;
      window.localStorage.setItem(localStorageKey, JSON.stringify(items));
      store.set({ localStorageItems: items });
    },
  }));

  return store;
};
