import { computed, shallowEqual, useCreateStore } from 'jastaman';
import { Field, GetDataTreeQuery, QueryResult } from 'types';
import { toast } from 'react-toastify';
import { Params } from '../TablePage';
import { keyValueStore } from '../../../lib/keyValue.store';
import { ConditionsService } from '../Conditions/Conditions.service';
import { SchemaTree, TableTree } from '../../DataTree/dataTree.types';

const defaultLimit = 10;

export type FieldInfo = {
  name: string;
  type: string;
  isPrimary: boolean;
  isNullable: boolean;
  default?: string;
};

export type TableDataStore = ReturnType<typeof useTableDataStore>;

const queryParams = {
  where: '',
  orderBy: '',
  limit: defaultLimit as number | undefined,
  offset: 0,
};

type OrderByMap = Record<string, { pos: number; dir: 'asc' | 'desc' }>;

export const useTableDataStore = ({
  params,
  sourceUrl,
  conditionsService,
}: {
  params: Params;
  sourceUrl?: string;
  conditionsService: ConditionsService;
}) => {
  const store = useCreateStore(
    () => ({
      state: {
        serverTree: undefined as GetDataTreeQuery | undefined,
        params,
        sourceUrl,
        rawFields: undefined as QueryResult['fields'] | undefined,
        rows: undefined as QueryResult['rows'] | undefined,
        count: undefined as number | undefined,
        queryParams,
        databaseUrl: computed<string | undefined>(),
        loading: computed<boolean>(),
        schema: computed<SchemaTree | undefined>(),
        table: computed<TableTree | undefined>(),
        fields: computed<FieldInfo[] | undefined>(),
        primaryColumns: computed<{ name: string; index: number }[]>(),
        defaults: computed<(string | undefined)[]>(),
        conditions: {
          where: conditionsService.getValue('where'),
          orderBy: conditionsService.getValue('orderBy'),
        },
        orderByMap: computed<OrderByMap>(),
      },
      computed: {
        databaseUrl: [
          (state) => [state.sourceUrl, state.params.databaseName],
          ({ sourceUrl, params }) =>
            sourceUrl && `${sourceUrl}/${params.databaseName}`,
        ],
        loading: [
          (state) => [state.serverTree, state.count, state.rows],
          (state) =>
            !state.serverTree ||
            state.count === undefined ||
            state.rows === undefined,
        ],
        schema: [
          (state) => [state.serverTree, state.params],
          ({ serverTree, params }) => {
            if (!serverTree || !params) return;

            const { databaseName, schemaName } = params;

            const database = serverTree.server.databases.find(
              (database) => database.name === databaseName,
            );
            if (!database) return;

            return database.schemas.find(
              (schema) => schema.name === schemaName,
            );
          },
        ],
        table: [
          (state) => [state.schema, state.params],
          ({ schema, params }) => {
            if (!schema || !params) return;

            const { tableName } = params;

            return schema.tables.find((table) => table.name === tableName);
          },
        ],
        fields: [
          (state) => [
            state.serverTree,
            state.schema,
            state.table,
            state.rawFields,
          ],
          (state) => {
            try {
              return getFieldsInfo(state);
            } catch (error) {
              toast((error as Error).message, { type: 'error' });
            }
          },
        ],
        primaryColumns: [
          ({ fields }) => [fields],
          ({ fields }) =>
            fields
              ?.filter((field) => field.isPrimary)
              .map((field, index) => ({ name: field.name, index: index })) ||
            [],
        ],
        defaults: [
          ({ fields }) => [fields],
          ({ fields }) =>
            fields?.map(
              (field) => field.default && `default: ${field.default}`,
            ) || [],
        ],
        orderByMap: [
          (state) => [state.queryParams.orderBy],
          (state) => {
            const map: OrderByMap = {};
            state.queryParams.orderBy
              .toLowerCase()
              .split(',')
              .forEach((part, pos) => {
                const [column, dir] = part.trim().split(' ');
                map[column] = { pos, dir: dir === 'desc' ? 'desc' : 'asc' };
              });
            return map;
          },
        ],
      },
      setRows(rows: QueryResult['rows'] | undefined) {
        store.set({ rows });
      },
    }),
    {
      setOnChange: { params, sourceUrl },
    },
  );

  keyValueStore.useEffect(
    () => [
      conditionsService.getValue('where'),
      conditionsService.getValue('orderBy'),
    ],
    shallowEqual,
    ([where, orderBy]) => {
      store.set({
        conditions: {
          where,
          orderBy,
        },
      });
    },
    [conditionsService],
  );

  return store;
};

const getFieldsInfo = ({
  table,
  rawFields,
}: {
  table?: TableTree;
  rawFields?: Field[];
}) => {
  if (!table || !rawFields) return;

  return rawFields.map(({ name, type }) => {
    const column = table.columns.find((column) => column.name === name);
    if (!column) {
      throw new Error(`Can't get definition of ${name} column`);
    }

    const isPrimary = table.indices.some(
      (index) => index.isPrimary && index.columnNames.includes(name),
    );

    return {
      name,
      type: type,
      isPrimary,
      isNullable: !column.isNullable,
      default: column.default || undefined,
    };
  });
};
