import { useMemo } from 'react';
import { OpenState, useCreateOpenState } from './open.state';
import { SearchService } from '../Search/search.service';
import {
  ServerInLocalStore,
  ServerInLocalStoreWithDriver,
} from '../../Server/types';
import { GetDataTreeQuery } from 'types';

export type OpenService = ReturnType<typeof useCreateOpenService>;

export const useCreateOpenService = ({
  searchService,
  localServer,
  tree,
}: {
  searchService: SearchService;
  localServer: ServerInLocalStoreWithDriver;
  tree: GetDataTreeQuery;
}) => {
  const store = useCreateOpenState();

  searchService.useOnSearchChange((search) => {
    store.setAnimateClose(false);
    if (search) {
      store.setItems(createOpenStateFromSearch({ search, localServer, tree }));
    } else {
      store.setItemsFromLocalStorage();
    }
  });

  return useMemo(
    () => ({
      useAnimateClose() {
        return store.use('animateClose');
      },
      useIsItemOpen(...names: string[]) {
        return store.useIsItemOpen(...names) || false;
      },
      setIsItemOpen(open: boolean, ...names: string[]) {
        store.setIsItemOpen(open, ...names);
        store.setAnimateClose(true);

        if (!searchService.getSearch()) {
          store.saveStateToLocalStorage();
        }
      },
    }),
    [],
  );
};

const createOpenStateFromSearch = ({
  search,
  localServer,
  tree,
}: {
  search: string;
  localServer: ServerInLocalStore;
  tree: GetDataTreeQuery;
}) => {
  const lower = search.toLocaleLowerCase();

  const openState: OpenState = {};

  tree.server.databases.forEach((database) => {
    if (database.name.toLocaleLowerCase().includes(lower)) {
      openItem(openState, localServer.name);
    }

    database.schemas.forEach((schema) => {
      if (schema.name.toLocaleLowerCase().includes(lower)) {
        openItem(openState, localServer.name, database.name);
      }

      schema.tables.forEach((table) => {
        if (table.name.toLocaleLowerCase().includes(lower)) {
          openItem(
            openState,
            localServer.name,
            database.name,
            schema.name,
            'tables',
          );
        }
      });

      schema.views.forEach((view) => {
        if (view.name.toLocaleLowerCase().includes(lower)) {
          openItem(
            openState,
            localServer.name,
            database.name,
            schema.name,
            'views',
          );
        }
      });
    });
  });

  return openState;
};

const openItem = (openState: OpenState, ...names: string[]): OpenState => {
  let state = openState;
  const len = names.length;
  for (let i = 0; i < len; i++) {
    const name = names[i];
    if (!state[name]) {
      state[name] = { open: true, items: {} };
    } else {
      state[name].open = true;
    }
    state = state[name].items;
  }
  return state;
};
