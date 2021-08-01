import React from 'react';
import { Index as IndexType } from '../../../components/DataTree/dataTree.service';
import { createOpenState } from '../../../components/DataTree/open.state';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { Info } from '../../../icons';
import { PathState } from '../../../components/DataTree/path.state';
import routes from '../../../lib/routes';

export default function Index({
  sourceName,
  databaseName,
  schemaName,
  paddingLeft,
  index,
  openState,
}: {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  paddingLeft: number;
  index: IndexType;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = index;

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <div className="relative flex-center mr-2.5">
          <Info size={16} className="text-accent" />
          {index.isUnique && (
            <sub className="absolute text-xs text-light-4 font-bold -right-1 -bottom-1.5 mr-px">
              U
            </sub>
          )}
        </div>
      )}
      title={
        <div className="flex-center">
          {name}
          <div className="text-sm ml-2 text-light-4">
            ({index.columnNames.join(', ')})
            {index.isUnique && <span className="ml-2">UNIQUE</span>}
          </div>
        </div>
      }
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    />
  );
}
