import React, { ReactNode } from 'react';
import TreeItem from '../TreeItems/TreeItem';
import { Folder as FolderIcon } from '../../../icons';
import { PathState } from '../path.state';
import cn from 'classnames';
import { Folder as FolderType } from '../dataTree.types';
import { useDataTreeServerContext } from '../server.context';

export default function Folder({
  serverName,
  databaseName,
  schemaName,
  type,
  count,
  top,
  paddingLeft,
  children,
}: {
  serverName: string;
  databaseName: string;
  schemaName: string;
  type: FolderType;
  count: number;
  top: number;
  paddingLeft: number;
  children: ReactNode;
}) {
  const { openService } = useDataTreeServerContext();
  const open = openService.useIsItemOpen(
    serverName,
    databaseName,
    schemaName,
    type,
  );

  return (
    <TreeItem
      key={type}
      className="relative"
      paddingLeft={paddingLeft}
      buttonStyle={{ top: `${top}px`, zIndex: 8 }}
      icon={(match) => (
        <FolderIcon size={16} className={cn('mr-2', !match && 'text-accent')} />
      )}
      name={type}
      title={(name) => (
        <>
          {name}
          <div className="text-sm mt-0.5 ml-2 text-light-6">{count}</div>
        </>
      )}
      open={open}
      setOpen={(open) =>
        openService.setIsItemOpen(
          open,
          serverName,
          databaseName,
          schemaName,
          type,
        )
      }
      openTree={() =>
        PathState.setPath([serverName, databaseName, schemaName, type])
      }
    >
      {children}
    </TreeItem>
  );
}
