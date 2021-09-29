import React from 'react';
import { createOpenState } from '../open.state';
import TreeItem from '../TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Pageview } from '../../../icons';
import { PathState } from '../path.state';
import Column from '../TreeItems/Column';
import { ViewTree } from '../dataTree.types';

export default function View({
  serverName,
  databaseName,
  schemaName,
  paddingLeft,
  view,
  top,
  openState,
}: {
  serverName: string;
  databaseName: string;
  schemaName: string;
  paddingLeft: number;
  view: ViewTree;
  top: number;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = view;
  const open = openState.useItem(
    serverName,
    databaseName,
    schemaName,
    'views',
    name,
  );
  const innerPaddingLeft = paddingLeft + 36;

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ top: `${top}px`, zIndex: 7 }}
      icon={() => (
        <div className="h-4 w-4 relative mr-2">
          <Pageview
            size={19}
            className="absolute -top-0.5 -left-0.5 text-accent"
          />
        </div>
      )}
      title={name}
      open={open}
      setOpen={(open) =>
        openState.setItem(
          open,
          serverName,
          databaseName,
          schemaName,
          'views',
          name,
        )
      }
      openTree={() =>
        PathState.setPath([serverName, databaseName, schemaName, name])
      }
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    >
      {view.columns.map((column) => (
        <Column
          key={column.name}
          column={column}
          paddingLeft={innerPaddingLeft}
        />
      ))}
    </TreeItem>
  );
}
