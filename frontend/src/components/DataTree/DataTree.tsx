import React from 'react';
import {
  DataSourceTree,
  useDataTreeForSidebar,
} from 'components/DataTree/dataTree.service';
import DataSource from 'components/DataTree/TreeItems/DataSource';
import Breadcrumbs from 'components/DataTree/Breadcrumbs/Breadcrumbs';
import { useObserver } from 'mobx-react-lite';
import { PathState } from 'components/DataTree/path.state';
import Database from 'components/DataTree/TreeItems/Database';
import Schema from 'components/DataTree/TreeItems/Schema';
import Table from 'components/DataTree/TreeItems/Table';
import { createOpenState } from 'components/DataTree/open.state';

const top = 48;
const paddingLeft = 8;

const DisplayTree = ({
  path,
  tree,
  openState,
}: {
  path: string[];
  tree: DataSourceTree[];
  openState: ReturnType<typeof createOpenState>;
}) => {
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
      <DataSource
        key={source.url}
        top={top}
        source={source}
        openState={openState}
        paddingLeft={paddingLeft}
      />
    );
  }

  return (
    <>
      {tree.map((source) => (
        <DataSource
          key={source.url}
          top={top}
          source={source}
          openState={openState}
          paddingLeft={paddingLeft}
        />
      ))}
    </>
  );
};

export default function DataTree() {
  const { tree, openState } = useDataTreeForSidebar();
  const path = useObserver(() => PathState.path);

  if (!tree || !openState) return null;

  const style = {
    transform: path.length ? 'translateY(0)' : 'translateY(-48px)',
  };

  return (
    <div className="duration-300 transition" style={style}>
      <Breadcrumbs />
      <DisplayTree path={path} tree={tree} openState={openState} />
    </div>
  );
}
