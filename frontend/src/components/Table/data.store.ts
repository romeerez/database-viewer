import { useLocalObservable } from 'mobx-react-lite';
import { Field, GetDataTreeQuery, QueryResult } from 'generated/graphql';
import { useDataTree } from 'components/DataTree/dataTree.service';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouteMatch } from 'react-router-dom';
import { dataSourcesStore } from 'components/DataSource/dataSource.store';

const defaultLimit = 10;

export type FieldInfo = {
  name: string;
  type: string;
  isNullable: boolean;
  default?: string;
};

export type DataStore = ReturnType<typeof useDataStore>;

export type Params = {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  tableName: string;
};

export const useDataStore = () => {
  const { tree } = useDataTree();
  const { params } = useRouteMatch<Params>();

  const store = useLocalObservable(() => {
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
      newRows: {} as Record<number, true>,
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
      setNewRow(index: number) {
        store.newRows[index] = true;
      },
      addRow(row: string[]) {
        store.rows?.push(row);
      },
      getValue(rowIndex: number, columnIndex: number) {
        return store.rows?.[rowIndex]?.[columnIndex];
      },
      setValue(rowIndex: number, columnIndex: number, value: string | null) {
        const row = store.rows?.[rowIndex];
        if (row) {
          row[columnIndex] = value;
        }
      },
    };
  });

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

    return {
      name,
      type: type.name,
      isNullable: !column.isNullable,
      default: column.default || undefined,
    };
  });
};
