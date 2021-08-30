import { useLocalObservable } from 'mobx-react-lite';
import { Field, GetDataTreeQuery, QueryResult } from 'types';
import { useDataTree } from '../../../components/DataTree/dataTree.service';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouteMatch } from 'react-router-dom';
import { dataSourcesStore } from '../../../components/DataSource/dataSource.store';
import { observable } from 'mobx';

const defaultLimit = 10;

export type FieldInfo = {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  default?: string;
};

export type TableDataStore = ReturnType<typeof useDataStore>;

export type Params = {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  tableName: string;
};

export type Selection = Record<number, Record<number, true>>;

export const useDataStore = () => {
  const { tree } = useDataTree();
  const { params } = useRouteMatch<Params>();

  const store = useLocalObservable(
    () => {
      const queryParams = {
        where: '',
        orderBy: '',
        limit: defaultLimit as number | undefined,
        offset: 0,
      };

      return {
        tree,
        params,
        rawFields: undefined as QueryResult['fields'] | undefined,
        rows: undefined as QueryResult['rows'] | undefined,
        count: undefined as number | undefined,
        queryParams,
        get databaseUrl() {
          const { sourceUrl } = store;
          return sourceUrl ? `${sourceUrl}/${params.databaseName}` : undefined;
        },
        get loading(): boolean {
          return (
            !store.tree || store.count === undefined || store.rows === undefined
          );
        },
        get fields(): FieldInfo[] | undefined {
          try {
            return getFieldsInfo(store);
          } catch (error) {
            toast(error.message, { type: 'error' });
          }
        },
        get primaryColumns(): { name: string; index: number }[] {
          return (
            store.fields
              ?.filter((field) => field.isPrimary)
              .map((field, index) => ({ name: field.name, index: index })) || []
          );
        },
        get sourceUrl() {
          const { sourceName } = store.params;
          const localDataSources = dataSourcesStore.dataSources;
          const source = localDataSources?.find(
            (source) => source.name === sourceName,
          );

          return source?.url;
        },
        get defaults() {
          return store.fields?.map(
            (field) => field.default && `default: ${field.default}`,
          );
        },
        setRows(rows: QueryResult['rows'] | undefined) {
          store.rows = rows;
        },
        update(
          values: Partial<{
            tree: typeof tree;
            params: typeof params;
            rawFields: QueryResult['fields'] | undefined;
            rows: QueryResult['rows'] | undefined;
            count: number | undefined;
          }>,
        ) {
          Object.assign(store, values);
        },
        updateQueryParams(values: Partial<typeof queryParams>) {
          Object.assign(store.queryParams, values);
        },
      };
    },
    {
      tree: observable.shallow,
      rawFields: observable.shallow,
    },
  );

  useEffect(() => {
    store.update({ tree, params });
  }, [tree, params]);

  return store;
};

const getFieldsInfo = ({
  tree,
  params: { databaseName, schemaName, tableName },
  sourceUrl,
  rawFields,
}: {
  tree?: GetDataTreeQuery;
  params: Params;
  sourceUrl?: string;
  rawFields?: Field[];
}) => {
  if (!tree || !sourceUrl || !rawFields) return;

  const source = tree.dataSources.find((source) => source.url === sourceUrl);
  if (!source) return;

  const database = source.databases.find(
    (database) => database.name === databaseName,
  );
  if (!database) return;

  const schema = database.schemas.find((schema) => schema.name === schemaName);
  if (!schema) return;

  const table = schema.tables.find((table) => table.name === tableName);
  if (!table) return;

  const sourceTypes = source.types;
  const schemaTypes = schema.types;

  return rawFields.map(({ name, type: typeId }) => {
    const schemaType = schemaTypes.find((type) => type.id === typeId);
    const type = schemaType || sourceTypes.find((type) => type.id === typeId);
    if (!type) {
      throw new Error(`Can't find type for ${name} column`);
    }

    const column = table.columns.find((column) => column.name === name);
    if (!column) {
      throw new Error(`Can't get definition of ${name} column`);
    }

    const isPrimary = table.indices.some(
      (index) => index.isPrimary && index.columnNames.includes(name),
    );

    return {
      name,
      type: type.name,
      isPrimary,
      isNullable: !column.isNullable,
      default: column.default || undefined,
    };
  });
};
