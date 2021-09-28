import React from 'react';
import { ServerTree } from '../../components/DataTree/dataTree.service';
import { createOpenState } from '../../components/DataTree/open.state';
import Table from '../../components/DataTree/TreeItems/Table';
import Schema from '../../components/DataTree/TreeItems/Schema';
import Database from '../../components/DataTree/TreeItems/Database';
import Server from '../../components/DataTree/TreeItems/Server';

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

  const source = len > 0 && tree.find(({ name }) => name === path[0]);
  if (source) {
    const database =
      len > 1 && source.databases.find(({ name }) => name === path[1]);
    if (database) {
      const schema =
        len > 2 && database.schemas.find(({ name }) => name === path[2]);
      if (schema) {
        const table =
          len > 3 && schema.tables.find(({ name }) => name === path[3]);
        if (table) {
          return (
            <Table
              key={source.url}
              top={top}
              sourceName={source.name}
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
            key={source.url}
            top={top}
            sourceName={source.name}
            databaseName={database.name}
            schema={schema}
            openState={openState}
            paddingLeft={paddingLeft}
          />
        );
      }

      return (
        <Database
          key={source.url}
          top={top}
          sourceName={source.name}
          database={database}
          openState={openState}
          paddingLeft={paddingLeft}
        />
      );
    }

    return (
      <Server
        key={source.url}
        top={top}
        zIndex={serverZIndex}
        source={source}
        openState={openState}
        paddingLeft={paddingLeft}
      />
    );
  }

  const zIndex = serverZIndex + tree.length - 1;

  return (
    <>
      {tree.map((source, i) => (
        <Server
          key={source.url}
          top={top}
          zIndex={zIndex - i}
          source={source}
          openState={openState}
          paddingLeft={paddingLeft}
        />
      ))}
    </>
  );
}
