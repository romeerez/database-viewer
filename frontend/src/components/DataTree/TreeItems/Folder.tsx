import React, { ReactNode } from 'react';
import { createOpenState } from '../open.state';
import TreeItem from '../TreeItems/TreeItem';
import { Folder as FolderIcon } from '../../../icons';
import { PathState } from '../path.state';
import cn from 'classnames';
import { Folder as FolderType } from '../dataTree.types';

export default function Folder({
  sourceName,
  databaseName,
  schemaName,
  type,
  count,
  top,
  paddingLeft,
  openState,
  children,
}: {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  type: FolderType;
  count: number;
  top: number;
  paddingLeft: number;
  openState: ReturnType<typeof createOpenState>;
  children: ReactNode;
}) {
  const open = openState.useItem(sourceName, databaseName, schemaName, type);

  return (
    <TreeItem
      key={type}
      className="relative"
      paddingLeft={paddingLeft}
      buttonStyle={{ top: `${top}px`, zIndex: 8 }}
      icon={(match) => (
        <FolderIcon size={16} className={cn('mr-2', !match && 'text-accent')} />
      )}
      title={
        <>
          {type}
          <div className="text-sm mt-0.5 ml-2 text-light-6">{count}</div>
        </>
      }
      open={open}
      setOpen={(open) =>
        openState.setItem(open, sourceName, databaseName, schemaName, type)
      }
      openTree={() =>
        PathState.setPath([sourceName, databaseName, schemaName, type])
      }
    >
      {children}
    </TreeItem>
  );
}
