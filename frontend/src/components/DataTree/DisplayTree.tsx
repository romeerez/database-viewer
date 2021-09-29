import React from 'react';
import { createOpenState } from './open.state';
import Table from '../../components/DataTree/TreeItems/Table';
import Schema from '../../components/DataTree/TreeItems/Schema';
import Database from '../../components/DataTree/TreeItems/Database';
import Server from '../../components/DataTree/TreeItems/Server';
import { ServerTree } from './dataTree.types';

const top = 48;
const paddingLeft = 8;
const serverZIndex = 10;

export default function DisplayTree({
  path,
  tree,
  openState,
}: {
  path: string[];
  tree: ServerTree[];
  openState: ReturnType<typeof createOpenState>;
}) {
  const len = path.length;

  const server = len > 0 && tree.find(({ name }) => name === path[0]);
  if (server) {
    const database =
      len > 1 && server.databases.find(({ name }) => name === path[1]);
    if (database) {
      const schema =
        len > 2 && database.schemas.find(({ name }) => name === path[2]);
      if (schema) {
        const table =
          len > 3 && schema.tables.find(({ name }) => name === path[3]);
        if (table) {
          return (
            <Table
              key={server.url}
              top={top}
              serverName={server.name}
              databaseName={database.name}
              schemaName={schema.name}
              table={table}
              openState={openState}
              paddingLeft={paddingLeft}
            />
          );
        }

        return (
          <Schema
            key={server.url}
            top={top}
            serverName={server.name}
            databaseName={database.name}
            schema={schema}
            openState={openState}
            paddingLeft={paddingLeft}
          />
        );
      }

      return (
        <Database
          key={server.url}
          top={top}
          server={server}
          serverName={server.name}
          database={database}
          openState={openState}
          paddingLeft={paddingLeft}
        />
      );
    }

    return (
      <Server
        key={server.url}
        top={top}
        zIndex={serverZIndex}
        server={server}
        openState={openState}
        paddingLeft={paddingLeft}
      />
    );
  }

  const zIndex = serverZIndex + tree.length - 1;

  return (
    <>
      {tree.map((server, i) => (
        <Server
          key={server.url}
          top={top}
          zIndex={zIndex - i}
          server={server}
          openState={openState}
          paddingLeft={paddingLeft}
        />
      ))}
    </>
  );
}
