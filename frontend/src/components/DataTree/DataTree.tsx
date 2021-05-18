import React from 'react';
import { useDataTreeForSidebar } from 'components/DataTree/dataTree.service';
import Scrollbars from 'components/Common/Scrollbars';
import Breadcrumbs from 'components/DataTree/Breadcrumbs/Breadcrumbs';
import { useObserver } from 'mobx-react-lite';
import { PathState } from 'components/DataTree/path.state';
import Search from 'components/DataTree/Search';
import DisplayTree from 'components/DataTree/DisplayTree';
import AddConnectionButton from 'components/DataTree/AddConnectionButton';

export default function DataTree() {
  const { tree, openState } = useDataTreeForSidebar();
  const path = useObserver(() => PathState.path);

  return (
    <>
      <div className="p-4 flex items-center">
        <Search />
        <AddConnectionButton />
      </div>
      <Scrollbars>
        <div className="p-4 pt-0 inline-block min-w-full">
          {tree && openState && (
            <div
              className="duration-300 transition"
              style={{
                transform: path.length ? 'translateY(0)' : 'translateY(-48px)',
              }}
            >
              <Breadcrumbs />
              <DisplayTree path={path} tree={tree} openState={openState} />
            </div>
          )}
        </div>
      </Scrollbars>
    </>
  );
}
