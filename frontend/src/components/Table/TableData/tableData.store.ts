import { computed, shallowEqual, useCreateStore } from 'jastaman';
import {
  SchemaTree,
  TableTree,
  useDataTree,
} from '../../DataTree/dataTree.service';
import { Field, GetDataTreeQuery, QueryResult } from 'types';
import { toast } from 'react-toastify';
import { getTypeName } from '../../../lib/utils';
import { Params } from '../TablePage';
import { keyValueStore } from '../../../lib/keyValue.store';
import { ConditionsService } from '../Conditions/Conditions.service';

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

export const useTableDataStore = ({
  params,
  sourceUrl,
  conditionsService,
}: {
  params: Params;
  sourceUrl?: string;
  conditionsService: ConditionsService;
}) => {
  const { tree } = useDataTree();

  const store = useCreateStore(
    () => ({
      state: {
        tree,
        params,
        sourceUrl,
        rawFields: undefined as QueryResult['fields'] | undefined,
        rows: undefined as QueryResult['rows'] | undefined,
        count: undefined as number | undefined,
        queryParams,
        databaseUrl: computed<string | undefined>(),
        loading: computed<boolean>(),
        source: computed<GetDataTreeQuery['dataSources'][number] | undefined>(),
        schema: computed<SchemaTree | undefined>(),
        table: computed<TableTree | undefined>(),
        fields: computed<FieldInfo[] | undefined>(),
        primaryColumns: computed<{ name: string; index: number }[]>(),
        defaults: computed<(string | undefined)[]>(),
        conditions: {
          where: conditionsService.getValue('where'),
          orderBy: conditionsService.getValue('orderBy'),
        },
      },
      computed: {
        databaseUrl: [
          (state) => [state.sourceUrl, state.params.databaseName],
          ({ sourceUrl, params }) =>
            sourceUrl && `${sourceUrl}/${params.databaseName}`,
        ],
        loading: [
          (state) => [state.tree, state.count, state.rows],
          (state) =>
            !state.tree ||
            state.count === undefined ||
            state.rows === undefined,
        ],
        source: [
          (state) => [state.tree, state.sourceUrl, state.params],
          ({ tree, sourceUrl, params }) => {
            if (!tree || !sourceUrl || !params) return;

            return tree.dataSources.find((source) => source.url === sourceUrl);
          },
        ],
        schema: [
          (state) => [state.source, state.params],
          ({ source, params }) => {
            if (!source || !params) return;

            const { databaseName, schemaName } = params;

            const database = source.databases.find(
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
          (state) => [state.source, state.schema, state.table, state.rawFields],
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
      },
      setRows(rows: QueryResult['rows'] | undefined) {
        store.set({ rows });
      },
    }),
    {
      setOnChange: { params, sourceUrl, tree },
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
  source,
  schema,
  table,
  rawFields,
}: {
  source?: GetDataTreeQuery['dataSources'][number];
  schema?: SchemaTree;
  table?: TableTree;
  params: Params;
  sourceUrl?: string;
  rawFields?: Field[];
}) => {
  if (!source || !schema || !table || !rawFields) return;

  const sourceTypes = source.types;
  const schemaTypes = schema.types;

  return rawFields.map(({ name, type: typeId }) => {
    const type = getTypeName(typeId, schemaTypes, sourceTypes);
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
      type: type,
      isPrimary,
      isNullable: !column.isNullable,
      default: column.default || undefined,
    };
  });
};
