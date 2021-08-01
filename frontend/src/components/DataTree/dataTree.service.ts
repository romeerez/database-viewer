import { useEffect, useState } from 'react';
import { GetDataTreeQuery, useAPIContext } from 'graphql-react-provider';
import { DataSourceInLocalStoreWithDriver } from '../../components/DataSource/types';
import { useObserver } from 'mobx-react-lite';
import {
  DataTreeState,
  noSearchOpenState,
  searchOpenState,
} from '../../components/DataTree/dataTree.state';
import { dataSourcesStore } from '../../components/DataSource/dataSource.store';

export type DataSourceTree = Exclude<
  ReturnType<typeof mapDataTree>,
  undefined
>[number];

export type DatabaseTree = DataSourceTree['databases'][number];

export type SchemaTree = DatabaseTree['schemas'][number];

export type TableTree = SchemaTree['tables'][number];

export type Column = TableTree['columns'][number];

export type Index = TableTree['indices'][number];

export type Constraint = TableTree['constraints'][number];

export type ForeignKey = TableTree['foreignKeys'][number];

const lowerCache: Record<string, string> = {};

const toLower = (string: string) =>
  lowerCache[string] || (lowerCache[string] = string.toLocaleLowerCase());

const mapDataTree = (
  dataSourcesLocal: DataSourceInLocalStoreWithDriver[],
  data: GetDataTreeQuery,
  search: string,
) => {
  if (!data) return undefined;

  const tree = data.dataSources
    .map((source) => {
      const dataSourceInLocalDb = dataSourcesLocal?.find(
        (local) => local.url === source.url,
      );

      return (
        dataSourceInLocalDb && {
          ...source,
          name: dataSourceInLocalDb.name,
          dataSourceInLocalDb,
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

  tree.forEach((source) => {
    if (toLower(source.name).includes(lower))
      filterSources[source.name] = false;

    source.databases.forEach((database) => {
      if (toLower(database.name).includes(lower)) {
        filterSources[source.name] = true;
        filterDatabases[database.name] = false;
      }

      database.schemas.forEach((schema) => {
        if (toLower(schema.name).includes(lower)) {
          filterSources[source.name] = true;
          filterDatabases[database.name] = true;
          filterSchemas[schema.name] = false;
        }

        schema.tables.forEach((table) => {
          if (toLower(table.name).includes(lower)) {
            filterSources[source.name] = true;
            filterDatabases[database.name] = true;
            filterSchemas[schema.name] = true;
            filterTables[table.name] = false;
          }
        });
      });
    });
  });

  return tree.reduce((sources: typeof tree, source) => {
    const open = filterSources[source.name];
    if (open !== undefined) {
      sources.push({
        ...source,
        databases: !open
          ? []
          : source.databases.reduce(
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
  const dataSourcesLocal = useObserver(() => dataSourcesStore.dataSources);

  const [tree, setTree] = useState<GetDataTreeQuery>();

  const { useGetDataTreeLazyQuery } = useAPIContext();

  const [load] = useGetDataTreeLazyQuery({
    onCompleted(data) {
      setTree((tree) => {
        if (!tree) return data;
        if (!dataSourcesLocal) return { ...data, dataSources: [] };

        const map: Record<string, GetDataTreeQuery['dataSources'][number]> = {};
        tree.dataSources.forEach((item) => {
          map[item.url] = item;
        });
        data.dataSources.forEach((item) => {
          map[item.url] = item;
        });

        return {
          dataSources: dataSourcesLocal
            .map((item) => map[item.url])
            .filter((item) => item),
        };
      });
    },
  });

  useEffect(() => {
    if (!dataSourcesLocal) return;

    const urls = dataSourcesLocal.map((item) => item.url);
    let filteredUrls = urls;

    if (tree) {
      filteredUrls = filteredUrls.filter(
        (url) => !tree.dataSources.some((item) => item.url === url),
      );
    }

    if (!filteredUrls.length) {
      setTree((tree) =>
        tree
          ? {
              ...tree,
              dataSources: tree.dataSources.filter((item) =>
                urls.includes(item.url),
              ),
            }
          : tree,
      );
      return;
    }

    load({
      variables: {
        urls: filteredUrls,
      },
    });
  }, [dataSourcesLocal]);

  return {
    dataSourcesLocal,
    tree,
  };
};

export const useDataTreeForSidebar = () => {
  const { dataSourcesLocal, tree: loadedTree } = useDataTree();

  const [prevSearch, setPrevSearch] = useState('');
  const search = useObserver(() => DataTreeState.search);

  useEffect(() => {
    if (search && search !== prevSearch) {
      searchOpenState.reset();
      setPrevSearch(search);
    }
  }, [search, prevSearch]);

  const tree =
    (dataSourcesLocal &&
      loadedTree &&
      (!search || search === prevSearch) &&
      mapDataTree(dataSourcesLocal, loadedTree, search)) ||
    undefined;

  const openState = search ? searchOpenState : noSearchOpenState;

  return {
    tree,
    openState,
  };
};
