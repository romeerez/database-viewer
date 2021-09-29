import React from 'react';
import { Postgresql } from '../../../icons';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import { createOpenState } from '../open.state';
import Database from '../../../components/DataTree/TreeItems/Database';
import { PathState } from '../path.state';
import routes from '../../../lib/routes';
import cn from 'classnames';
import { modalsState } from '../dataTree.state';
import { ServerTree } from '../dataTree.types';

export default function Server({
  top,
  zIndex,
  paddingLeft,
  source,
  openState,
}: {
  top: number;
  zIndex: number;
  paddingLeft: number;
  source: ServerTree;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = source;
  const open = openState.useItem(name);
  const innerTop = top + 32;
  const innerPaddingLeft = paddingLeft + 16;

  return (
    <TreeItem
      key={source.url}
      className="relative flex flex-col"
      paddingLeft={paddingLeft}
      buttonStyle={{ top, zIndex }}
      icon={(match) => (
        <Postgresql size={16} className={cn('mr-2', !match && 'text-accent')} />
      )}
      title={name}
      open={open}
      setOpen={(open) => openState.setItem(open, name)}
      openTree={() => PathState.setPath([name])}
      to={routes.server(name)}
      menu={(toggle) => (
        <>
          <MenuItem
            onClick={() => {
              modalsState.setServerForEdit(source.serverInLocalDb);
              toggle();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              modalsState.setServerForDelete(source.serverInLocalDb);
              toggle();
            }}
          >
            Delete
          </MenuItem>
        </>
      )}
    >
      {source.databases.map((database) => (
        <Database
          key={database.name}
          source={source}
          sourceName={name}
          database={database}
          openState={openState}
          top={innerTop}
          paddingLeft={innerPaddingLeft}
        />
      ))}
    </TreeItem>
  );
}
