import React, { useMemo } from 'react';
import { createOpenState } from '../open.state';
import TreeItem from '../TreeItems/TreeItem';
import MenuItem from '../../Common/Menu/MenuItem';
import { FlowChart } from '../../../icons';
import Folder from '../TreeItems/Folder';
import { PathState } from '../path.state';
import routes from '../../../lib/routes';
import cn from 'classnames';
import { Folder as FolderType, SchemaTree } from '../dataTree.types';
import Table from './Table';
import View from './View';
import Procedure from './Procedure';

export default function Schema({
  serverName,
  databaseName,
  top,
  paddingLeft,
  schema,
  openState,
}: {
  serverName: string;
  databaseName: string;
  top: number;
  paddingLeft: number;
  schema: SchemaTree;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = schema;
  const open = openState.useItem(serverName, databaseName, name);

  const folderTop = top + 32;
  const folderPaddingLeft = paddingLeft + 16;

  const innerTop = folderTop + 32;
  const innerPaddingLeft = folderPaddingLeft + 16;

  const [routines, triggers, aggregates] = useMemo(
    () => [
      schema.procedures.filter((proc) => proc.kind === 'f' && !proc.isTrigger),
      schema.procedures.filter((proc) => proc.isTrigger),
      schema.procedures.filter((proc) => proc.kind === 'a'),
    ],
    [schema.procedures],
  );

  return (
    <TreeItem
      key={name}
      className="relative"
      paddingLeft={paddingLeft}
      buttonStyle={{ top: `${top}px`, zIndex: 8 }}
      icon={(match) => (
        <FlowChart size={16} className={cn('mr-2', !match && 'text-accent')} />
      )}
      title={name}
      open={open}
      setOpen={(open) =>
        openState.setItem(open, serverName, databaseName, name)
      }
      openTree={() => PathState.setPath([serverName, databaseName, name])}
      to={routes.schema(serverName, databaseName, name)}
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    >
      <Folder
        serverName={serverName}
        databaseName={databaseName}
        schemaName={schema.name}
        type={FolderType.tables}
        count={schema.tables.length}
        top={folderTop}
        paddingLeft={folderPaddingLeft}
        openState={openState}
      >
        {schema.tables.map((table) => (
          <Table
            key={table.name}
            serverName={serverName}
            databaseName={databaseName}
            schemaName={schema.name}
            table={table}
            top={innerTop}
            openState={openState}
            paddingLeft={innerPaddingLeft}
          />
        ))}
      </Folder>
      <Folder
        serverName={serverName}
        databaseName={databaseName}
        schemaName={schema.name}
        type={FolderType.views}
        count={schema.views.length}
        top={folderTop}
        paddingLeft={folderPaddingLeft}
        openState={openState}
      >
        {schema.views.map((view) => (
          <View
            key={view.name}
            serverName={serverName}
            databaseName={databaseName}
            schemaName={schema.name}
            view={view}
            top={innerTop}
            openState={openState}
            paddingLeft={innerPaddingLeft}
          />
        ))}
      </Folder>
      <Folder
        serverName={serverName}
        databaseName={databaseName}
        schemaName={schema.name}
        type={FolderType.routines}
        count={routines.length}
        top={folderTop}
        paddingLeft={folderPaddingLeft}
        openState={openState}
      >
        {routines.map((routine) => (
          <Procedure
            key={routine.name}
            procedure={routine}
            paddingLeft={innerPaddingLeft}
          />
        ))}
      </Folder>
      <Folder
        serverName={serverName}
        databaseName={databaseName}
        schemaName={schema.name}
        type={FolderType.triggers}
        count={triggers.length}
        top={folderTop}
        paddingLeft={folderPaddingLeft}
        openState={openState}
      >
        {triggers.map((routine) => (
          <Procedure
            key={routine.name}
            procedure={routine}
            paddingLeft={innerPaddingLeft}
          />
        ))}
      </Folder>
      <Folder
        serverName={serverName}
        databaseName={databaseName}
        schemaName={schema.name}
        type={FolderType.aggregates}
        count={aggregates.length}
        top={folderTop}
        paddingLeft={folderPaddingLeft}
        openState={openState}
      >
        {aggregates.map((routine) => (
          <Procedure
            key={routine.name}
            procedure={routine}
            paddingLeft={innerPaddingLeft}
          />
        ))}
      </Folder>
    </TreeItem>
  );
}
