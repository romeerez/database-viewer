import React from 'react';
import { ServerInLocalStoreWithDriver } from '../Server/types';
import { PathState } from './path.state';
import ServerItem from '../../components/DataTree/TreeItems/Server';
import Table from './TreeItems/Table';
import View from './TreeItems/View';
import Schema from './TreeItems/Schema';
import Database from './TreeItems/Database';
import { GetDataTreeQuery } from 'types';
import { useDataTreeContext } from './dataTree.context';
import { useCreateOpenService } from './OpenState/open.service';
import { DataTreeServerContext } from './server.context';
import { useLoadServerTree } from '../../api/server';

const top = 48;
const paddingLeft = 8;
const serverZIndex = 10;

export default function Server({
  localServer,
}: {
  localServer: ServerInLocalStoreWithDriver;
}) {
  const { data } = useLoadServerTree({ url: localServer.url });

  if (!data) return null;

  return <ServerContextWrap localServer={localServer} tree={data} />;
}

const ServerContextWrap = ({
  localServer,
  tree,
}: {
  localServer: ServerInLocalStoreWithDriver;
  tree: GetDataTreeQuery;
}) => {
  const { searchService } = useDataTreeContext();
  const openService = useCreateOpenService({
    searchService,
    localServer,
    tree,
  });

  return (
    <DataTreeServerContext.Provider value={{ openService }}>
      <ServerInner localServer={localServer} tree={tree} />
    </DataTreeServerContext.Provider>
  );
};

const ServerInner = ({
  localServer,
  tree,
}: {
  localServer: ServerInLocalStoreWithDriver;
  tree: GetDataTreeQuery;
}) => {
  const path = PathState.use('path');

  const { server } = tree;

  const [serverName, databaseName, schemaName, type, tableOrViewName] = path;
  if (serverName && serverName !== localServer.name) {
    return null;
  }

  const database =
    databaseName && server.databases.find(({ name }) => name === databaseName);
  if (database) {
    const schema =
      schemaName && database.schemas.find(({ name }) => name === schemaName);
    if (schema) {
      if (type === 'table') {
        const table =
          tableOrViewName &&
          schema.tables.find(({ name }) => name === tableOrViewName);
        if (table) {
          return (
            <Table
              serverName={localServer.name}
              databaseName={databaseName}
              schemaName={schemaName}
              paddingLeft={paddingLeft}
              table={table}
              top={top}
            />
          );
        }
      } else if (type === 'view') {
        const view =
          tableOrViewName &&
          schema.views.find(({ name }) => name === tableOrViewName);
        if (view) {
          return (
            <View
              serverName={localServer.name}
              databaseName={databaseName}
              schemaName={schemaName}
              paddingLeft={paddingLeft}
              view={view}
              top={top}
            />
          );
        }
      }

      return (
        <Schema
          serverName={localServer.name}
          databaseName={databaseName}
          top={top}
          paddingLeft={paddingLeft}
          schema={schema}
        />
      );
    }

    return (
      <Database
        server={server}
        serverName={localServer.name}
        top={top}
        paddingLeft={paddingLeft}
        database={database}
      />
    );
  }

  return (
    <ServerItem
      top={top}
      zIndex={serverZIndex}
      localServer={localServer}
      server={server}
      paddingLeft={paddingLeft}
    />
  );
};
