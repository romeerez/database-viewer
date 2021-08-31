import React from 'react';
import { TableTree } from '../dataTree.service';
import { createOpenState } from '../open.state';
import TreeItem from '../TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Table as TableIcon } from '../../../icons';
import { useObserver } from 'mobx-react-lite';
import { PathState } from '../path.state';
import Column from '../TreeItems/Column';
import Constraint from '../TreeItems/Constraint';
import ForeignKey from '../TreeItems/ForeignKey';
import Index from '../TreeItems/Index';
import Trigger from '../TreeItems/Trigger';
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
        <Index key={index.name} index={index} paddingLeft={innerPaddingLeft} />
      ))}
      {table.triggers.map((trigger) => (
        <Trigger
          key={trigger.name}
          trigger={trigger}
          paddingLeft={innerPaddingLeft}
        />
      ))}
    </TreeItem>
  );
}
