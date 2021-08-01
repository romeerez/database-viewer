import React from 'react';
import { TableTree } from '../../../components/DataTree/dataTree.service';
import { createOpenState } from '../../../components/DataTree/open.state';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Table as TableIcon } from '../../../icons';
import { useObserver } from 'mobx-react-lite';
import { PathState } from '../../../components/DataTree/path.state';
import Column from '../../../components/DataTree/TreeItems/Column';
import Constraint from '../../../components/DataTree/TreeItems/Constraint';
import ForeignKey from '../../../components/DataTree/TreeItems/ForeignKey';
import Index from '../../../components/DataTree/TreeItems/Index';
import routes from '../../../lib/routes';
import cn from 'classnames';

export default function Table({
  sourceName,
  databaseName,
  schemaName,
  paddingLeft,
  table,
  top,
  openState,
}: {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  paddingLeft: number;
  table: TableTree;
  top: number;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = table;
  const open = useObserver(() =>
    openState.getTable(sourceName, databaseName, schemaName, name),
  );
  const innerPaddingLeft = paddingLeft + 36;

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ top: `${top}px`, zIndex: 7 }}
      icon={(match) => (
        <TableIcon size={16} className={cn('mr-2', !match && 'text-accent')} />
      )}
      title={name}
      open={open}
      setOpen={(open) =>
        openState.setTable(sourceName, databaseName, schemaName, name, open)
      }
      openTree={() =>
        PathState.setPath([sourceName, databaseName, schemaName, name])
      }
      to={routes.table(sourceName, databaseName, schemaName, name)}
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    >
      {table.columns.map((column) => (
        <Column
          key={column.name}
          table={table}
          column={column}
          paddingLeft={innerPaddingLeft}
        />
      ))}
      {table.constraints.map((constraint) => (
        <Constraint
          key={constraint.name}
          sourceName={sourceName}
          databaseName={databaseName}
          schemaName={schemaName}
          constraint={constraint}
          openState={openState}
          paddingLeft={innerPaddingLeft}
        />
      ))}
      {table.foreignKeys.map((foreignKey) => (
        <ForeignKey
          key={foreignKey.name}
          sourceName={sourceName}
          databaseName={databaseName}
          schemaName={schemaName}
          foreignKey={foreignKey}
          openState={openState}
          paddingLeft={innerPaddingLeft}
        />
      ))}
      {table.indices.map((index) => (
        <Index
          key={index.name}
          sourceName={sourceName}
          databaseName={databaseName}
          schemaName={schemaName}
          index={index}
          openState={openState}
          paddingLeft={innerPaddingLeft}
        />
      ))}
    </TreeItem>
  );
}
