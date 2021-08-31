import { ipcMain } from 'electron';
import {
  CheckConnectionMutationVariables,
  CheckConnectionMutation,
  GetDataTreeQueryVariables,
  GetDataTreeQuery,
  QueryFieldsAndRowsQueryVariables,
  QueryFieldsAndRowsQuery,
  QueryRowsQueryVariables,
  QueryRowsQuery,
} from 'types';
import { getDB } from './db';
import * as dataLoader from 'data-loader';

ipcMain.handle(
  'CheckConnection',
  async (
    _,
    { variables }: { variables: CheckConnectionMutationVariables },
  ): Promise<CheckConnectionMutation> => {
    return {
      checkConnection: await dataLoader.checkConnection(getDB, variables),
    };
  },
);

const handle = <Arg, T>(channel: string, handler: (arg: Arg) => Promise<T>) => {
  ipcMain.handle(channel, async (_, arg) => {
    try {
      return { data: await handler(arg) };
    } catch (error) {
      return { error };
    }
  });
};

handle(
  'GetDataTreeQuery',
  async ({
    variables: { urls },
  }: {
    variables: GetDataTreeQueryVariables;
  }): Promise<GetDataTreeQuery> => {
    if (typeof urls === 'string') urls = [urls];
    const dataSources = dataLoader.getDataSources({ urls });

    const [types, databases] = await Promise.all([
      dataLoader.getSystemDataTypes(getDB, urls),
      dataLoader.getDatabases(getDB, urls),
    ]);

    const schemas = await dataLoader.getSchemas(
      getDB,
      databases.flat().map((obj) => obj.url),
    );

    const schemasFlat = schemas.flat();
    const [
      schemaTypes,
      { tables, columns, indices, foreignKeys, constraints, triggers },
      { views, viewColumns },
    ] = await Promise.all([
      dataLoader.getSchemaDataTypes(getDB, schemasFlat),
      dataLoader.getTables(getDB, schemasFlat).then(async (tables) => {
        const tablesFlat = tables.flat();
        const [columns, indices, foreignKeys, constraints, triggers] =
          await Promise.all([
            dataLoader.getColumns(getDB, tablesFlat),
            dataLoader.getIndices(getDB, tablesFlat),
            dataLoader.getForeignKeys(getDB, tablesFlat),
            dataLoader.getConstraints(getDB, tablesFlat),
            dataLoader.getTriggers(getDB, tablesFlat),
          ]);

        return { tables, columns, indices, foreignKeys, constraints, triggers };
      }),
      dataLoader.getViews(getDB, schemasFlat).then(async (views) => {
        const viewsFlat = views.flat();
        const viewColumns = await dataLoader.getColumns(getDB, viewsFlat);

        return { views, viewColumns };
      }),
    ]);

    let databaseIndex = -1;
    let schemaIndex = -1;
    let tableIndex = -1;
    let viewIndex = -1;

    return {
      dataSources: dataSources.map((obj, dataSourceIndex) => ({
        ...obj,
        types: types[dataSourceIndex],
        databases: databases[dataSourceIndex].map((database) => {
          databaseIndex++;

          return {
            ...database,
            schemas: schemas[databaseIndex].map((schema) => {
              schemaIndex++;

              return {
                ...schema,
                types: schemaTypes[schemaIndex],
                tables: tables[schemaIndex].map((table) => {
                  tableIndex++;

                  return {
                    ...table,
                    columns: columns[tableIndex],
                    indices: indices[tableIndex],
                    foreignKeys: foreignKeys[tableIndex],
                    constraints: constraints[tableIndex],
                    triggers: triggers[tableIndex],
                  };
                }),
                views: views[schemaIndex].map((view) => {
                  viewIndex++;

                  return {
                    ...view,
                    columns: viewColumns[viewIndex],
                  };
                }),
              };
            }),
          };
        }),
      })),
    };
  },
);

handle(
  'QueryFieldsAndRows',
  async ({
    variables,
  }: {
    variables: QueryFieldsAndRowsQueryVariables;
  }): Promise<QueryFieldsAndRowsQuery> => {
    return {
      executeQuery: await dataLoader.executeQuery(getDB, variables),
    };
  },
);

handle(
  'QueryRows',
  async ({
    variables,
  }: {
    variables: QueryRowsQueryVariables;
  }): Promise<QueryRowsQuery> => {
    return {
      executeQuery: await dataLoader.executeQuery(getDB, variables),
    };
  },
);
