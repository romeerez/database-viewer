import { useEffect, useState } from 'react';
import { ServerInLocalStoreWithDriver } from '../Server/types';
import {
  DataTreeState,
  noSearchOpenState,
  searchOpenState,
} from './dataTree.state';
import { serversStore } from '../Server/server.store';
import { GetDataTreeQuery } from 'types';
import { useAPIContext } from '../../lib/apiContext';

const lowerCache: Record<string, string> = {};

const toLower = (string: string) =>
  lowerCache[string] || (lowerCache[string] = string.toLocaleLowerCase());

export const mapDataTree = (
  serversLocal: ServerInLocalStoreWithDriver[],
  data: GetDataTreeQuery,
  search: string,
) => {
  if (!data) return undefined;

  const tree = data.servers
    .map((server) => {
      const serverInLocalDb = serversLocal?.find(
        (local) => local.url === server.url,
      );

      return (
        serverInLocalDb && {
          ...server,
          name: serverInLocalDb.name,
          serverInLocalDb,
        }
      );
    })
    .filter(<T>(item: T | undefined): item is T => Boolean(item));

  if (!search) return tree;

  const lower = search.toLocaleLowerCase();

  const filterSources: Record<string, boolean> = {};
  const filterDatabases: Record<string, boolean> = {};
  const filterSchemas: Record<string, boolean> = {};
  const filterTables: Record<string, boolean> = {};

  tree.forEach((server) => {
    if (toLower(server.name).includes(lower))
      filterSources[server.name] = false;

    server.databases.forEach((database) => {
      if (toLower(database.name).includes(lower)) {
        filterSources[server.name] = true;
        filterDatabases[database.name] = false;
      }

      database.schemas.forEach((schema) => {
        if (toLower(schema.name).includes(lower)) {
          filterSources[server.name] = true;
          filterDatabases[database.name] = true;
          filterSchemas[schema.name] = false;
        }

        schema.tables.forEach((table) => {
          if (toLower(table.name).includes(lower)) {
            filterSources[server.name] = true;
            filterDatabases[database.name] = true;
            filterSchemas[schema.name] = true;
            filterTables[table.name] = false;
          }
        });
      });
    });
  });

  return tree.reduce((sources: typeof tree, server) => {
    const open = filterSources[server.name];
    if (open !== undefined) {
      sources.push({
        ...server,
        databases: !open
          ? []
          : server.databases.reduce(
              (databases: typeof tree[0]['databases'], database) => {
                const open = filterDatabases[database.name];
                if (open !== undefined) {
                  databases.push({
                    ...database,
                    schemas: !open
                      ? []
                      : database.schemas.reduce(
                          (
                            schemas: typeof tree[0]['databases'][0]['schemas'],
                            schema,
                          ) => {
                            const open = filterSchemas[schema.name];
                            if (open !== undefined) {
                              schemas.push({
                                ...schema,
                                tables: !open
                                  ? []
                                  : schema.tables.reduce(
                                      (
                                        tables: typeof tree[0]['databases'][0]['schemas'][0]['tables'],
                                        table,
                                      ) => {
                                        const open = filterTables[table.name];
                                        if (open !== undefined) {
                                          tables.push(table);
                                        }

                                        return tables;
                                      },
                                      [],
                                    ),
                              });
                            }

                            return schemas;
                          },
                          [],
                        ),
                  });
                }

                return databases;
              },
              [],
            ),
      });
    }

    return sources;
  }, []);
};

export const useDataTree = () => {
  const { data: serversLocal } = serversStore.useServers();

  const [tree, setTree] = useState<GetDataTreeQuery>();

  const { useGetDataTreeLazyQuery } = useAPIContext();

  const [load] = useGetDataTreeLazyQuery({
    onCompleted(data) {
      console.log('loaded data', data);
      setTree((tree) => {
        console.log('already existing tree', tree);
        if (!tree) return data;
        console.log('serversLocal', serversLocal);
        if (!serversLocal) return { ...data, servers: [] };

        const map: Record<string, GetDataTreeQuery['servers'][number]> = {};
        tree.servers.forEach((item) => {
          map[item.url] = item;
        });
        data.servers.forEach((item) => {
          map[item.url] = item;
        });

        return {
          servers: serversLocal
            .map((item) => map[item.url])
            .filter((item) => item),
        };
      });
    },
  });

  useEffect(() => {
    if (!serversLocal) return;

    const urls = serversLocal.map((item) => item.url);
    let urlsToLoad = urls;

    if (tree) {
      urlsToLoad = urlsToLoad.filter(
        (url) => !tree.servers.some((item) => item.url === url),
      );
    }

    if (!urlsToLoad.length) {
      setTree((tree) =>
        tree
          ? {
              ...tree,
              servers: tree.servers.filter((item) => urls.includes(item.url)),
            }
          : tree,
      );
      return;
    }

    console.log('load', urlsToLoad);
    load({
      variables: {
        urls: urlsToLoad,
      },
    });
  }, [serversLocal]);

  return {
    serversLocal,
    tree,
  };
};

export const useDataTreeForSidebar = () => {
  const { serversLocal, tree: loadedTree } = useDataTree();

  const [prevSearch, setPrevSearch] = useState('');
  const search = DataTreeState.use('search');

  useEffect(() => {
    if (search && search !== prevSearch) {
      searchOpenState.reset();
      setPrevSearch(search);
    }
  }, [search, prevSearch]);

  const tree =
    (serversLocal &&
      loadedTree &&
      (!search || search === prevSearch) &&
      mapDataTree(serversLocal, loadedTree, search)) ||
    undefined;

  const openState = search ? searchOpenState : noSearchOpenState;

  return {
    tree,
    openState,
  };
};
