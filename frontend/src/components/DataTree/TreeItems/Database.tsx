import React from 'react';
import { Database as DatabaseIcon } from '../../../icons';
import { createOpenState } from '../../../components/DataTree/open.state';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import Schema from '../../../components/DataTree/TreeItems/Schema';
import { useObserver } from 'mobx-react-lite';
import { PathState } from '../../../components/DataTree/path.state';
import routes from '../../../lib/routes';
import cn from 'classnames';
import { DatabaseTree } from '../../../components/DataTree/dataTree.service';

export default function Database({
  sourceName,
  top,
  paddingLeft,
  database,
  openState,
}: {
  sourceName: string;
  top: number;
  paddingLeft: number;
  database: DatabaseTree;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = database;
  const open = useObserver(() => openState.getDatabase(sourceName, name));
  const innerTop = top + 32;
  const innerPaddingLeft = paddingLeft + 16;

  return (
    <TreeItem
      key={name}
      className="relative"
      paddingLeft={paddingLeft}
      buttonStyle={{ top: `${top}px`, zIndex: 9 }}
      icon={(match) => (
        <DatabaseIcon
          size={16}
          className={cn('mr-2', !match && 'text-accent')}
        />
      )}
      title={name}
      open={open}
      setOpen={(open) => openState.setDatabase(sourceName, name, open)}
      openTree={() => PathState.setPath([sourceName, name])}
      to={routes.database(sourceName, name)}
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    >
      {database.schemas.map((schema) => (
        <Schema
          key={schema.name}
          sourceName={sourceName}
          databaseName={name}
          schema={schema}
          openState={openState}
          top={innerTop}
          paddingLeft={innerPaddingLeft}
        />
      ))}
    </TreeItem>
  );
}
