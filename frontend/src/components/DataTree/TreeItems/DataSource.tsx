import React from 'react';
import { Postgresql } from 'icons';
import MenuItem from 'components/Common/Menu/MenuItem';
import TreeItem from 'components/DataTree/TreeItems/TreeItem';
import { DataSourceTree } from 'components/DataTree/dataTree.service';
import { createOpenState } from 'components/DataTree/open.state';
import Database from 'components/DataTree/TreeItems/Database';
import { useObserver } from 'mobx-react-lite';
import { PathState } from 'components/DataTree/path.state';
import routes from 'lib/routes';
import cn from 'classnames';

export default function DataSource({
  top,
  paddingLeft,
  source,
  openState,
}: {
  top: number;
  paddingLeft: number;
  source: DataSourceTree;
  openState: ReturnType<typeof createOpenState>;
}) {
  const { name } = source;
  const open = useObserver(() => openState.getDataSource(name));
  const innerTop = top + 32;
  const innerPaddingLeft = paddingLeft + 16;

  return (
    <TreeItem
      key={source.url}
      className="relative flex flex-col"
      paddingLeft={paddingLeft}
      buttonStyle={{ top, zIndex: 10 }}
      icon={(match) => (
        <Postgresql size={16} className={cn('mr-2', !match && 'text-accent')} />
      )}
      title={name}
      open={open}
      setOpen={(open) => openState.setDataSource(name, open)}
      openTree={() => PathState.setPath([name])}
      to={routes.dataSource(name)}
      menu={() => (
        <>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </>
      )}
    >
      {source.databases.map((database) => (
        <Database
          key={database.name}
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
