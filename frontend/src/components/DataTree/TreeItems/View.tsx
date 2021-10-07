import React from 'react';
import TreeItem from '../TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Pageview } from '../../../icons';
import { PathState } from '../path.state';
import Column from '../TreeItems/Column';
import { ViewTree } from '../dataTree.types';
import { useDataTreeServerContext } from '../server.context';

export default function View({
  serverName,
  databaseName,
  schemaName,
  paddingLeft,
  view,
  top,
}: {
  serverName: string;
  databaseName: string;
  schemaName: string;
  paddingLeft: number;
  view: ViewTree;
  top: number;
}) {
  const { openService } = useDataTreeServerContext();
  const { name } = view;
  const open = openService.useIsItemOpen(
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
      name={name}
      title={(name) => name}
      open={open}
      setOpen={(open) =>
        openService.setIsItemOpen(
          open,
          serverName,
          databaseName,
          schemaName,
          'views',
          name,
        )
      }
      openTree={() =>
        PathState.setPath([serverName, databaseName, schemaName, 'views', name])
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
