import React from 'react';
import { Postgresql } from '../../../icons';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import TreeItem from '../../../components/DataTree/TreeItems/TreeItem';
import Database from '../../../components/DataTree/TreeItems/Database';
import { PathState } from '../path.state';
import routes from '../../../lib/routes';
import cn from 'classnames';
import { ServerTree } from '../dataTree.types';
import { ServerInLocalStore } from '../../Server/types';
import { useDataTreeContext } from '../dataTree.context';
import { useDataTreeServerContext } from '../server.context';

export default function Server({
  top,
  zIndex,
  paddingLeft,
  localServer,
  server,
}: {
  top: number;
  zIndex: number;
  paddingLeft: number;
  localServer: ServerInLocalStore;
  server: ServerTree;
}) {
  const { modalsService } = useDataTreeContext();
  const { openService } = useDataTreeServerContext();
  const { name } = localServer;
  const open = openService.useIsItemOpen(name);
  const innerTop = top + 32;
  const innerPaddingLeft = paddingLeft + 16;

  return (
    <TreeItem
      key={server.url}
      className="relative flex flex-col"
      paddingLeft={paddingLeft}
      buttonStyle={{ top, zIndex }}
      icon={(match) => (
        <Postgresql size={16} className={cn('mr-2', !match && 'text-accent')} />
      )}
      name={name}
      title={(name) => name}
      open={open}
      setOpen={(open) => openService.setIsItemOpen(open, name)}
      openTree={() => PathState.setPath([name])}
      to={routes.server(name)}
      menu={(toggle) => (
        <>
          <MenuItem
            onClick={() => {
              modalsService.setServerForEdit(localServer);
              toggle();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              modalsService.setServerForDelete(localServer);
              toggle();
            }}
          >
            Delete
          </MenuItem>
        </>
      )}
    >
      {server.databases.map((database) => (
        <Database
          key={database.name}
          server={server}
          serverName={name}
          database={database}
          top={innerTop}
          paddingLeft={innerPaddingLeft}
        />
      ))}
    </TreeItem>
  );
}
