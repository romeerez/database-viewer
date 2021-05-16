import React from 'react';
import { SchemaTree } from 'components/DataTree/dataTree.service';
import { createOpenState } from 'components/DataTree/open.state';
import TreeItem from 'components/DataTree/TreeItems/TreeItem';
import MenuItem from 'components/Common/Menu/MenuItem';
import { FlowChart } from 'icons';
import Table from 'components/DataTree/TreeItems/Table';
import { useObserver } from 'mobx-react-lite';
import { PathState } from 'components/DataTree/path.state';
import routes from 'lib/routes';
import cn from 'classnames';

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
    openState.getSchema(sourceName, databaseName, name),
  );

  const innerTop = top + 32;
  const innerPaddingLeft = paddingLeft + 16;

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
        openState.setSchema(sourceName, databaseName, name, open)
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
      {schema.tables.map((table) => (
        <Table
          key={table.name}
          sourceName={sourceName}
          databaseName={databaseName}
          schemaName={name}
          table={table}
          top={innerTop}
          openState={openState}
          paddingLeft={innerPaddingLeft}
        />
      ))}
    </TreeItem>
  );
}
