import React from 'react';
import { SchemaTree } from '../dataTree.service';
import { createOpenState } from '../open.state';
import TreeItem from '../TreeItems/TreeItem';
import MenuItem from '../../Common/Menu/MenuItem';
import { FlowChart } from '../../../icons';
import Folder from '../TreeItems/Folder';
import { useObserver } from 'mobx-react-lite';
import { PathState } from '../path.state';
import routes from '../../../lib/routes';
import cn from 'classnames';
import { Folder as FolderType } from '../dataTree.types';
import Table from './Table';
import View from './View';

export default function Schema({
  sourceName,
  databaseName,
  top,
  paddingLeft,
  schema,
  openState,
}: {
  sourceName: string;
  databaseName: string;
  top: number;
  paddingLeft: number;
  schema: SchemaTree;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = schema;
  const open = useObserver(() =>
    openState.getItem(sourceName, databaseName, name),
  );

  const folderTop = top + 32;
  const folderPaddingLeft = paddingLeft + 16;

  const innerTop = folderTop + 32;
  const innerPaddingLeft = folderPaddingLeft + 16;

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
        openState.setItem(open, sourceName, databaseName, name)
      }
      openTree={() => PathState.setPath([sourceName, databaseName, name])}
      to={routes.schema(sourceName, databaseName, name)}
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    >
      <Folder
        sourceName={sourceName}
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
            sourceName={sourceName}
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
        sourceName={sourceName}
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
            sourceName={sourceName}
            databaseName={databaseName}
            schemaName={schema.name}
            view={view}
            top={innerTop}
            openState={openState}
            paddingLeft={innerPaddingLeft}
          />
        ))}
      </Folder>
    </TreeItem>
  );
}
