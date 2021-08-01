import React from 'react';
import { useDataTreeForSidebar } from '../../components/DataTree/dataTree.service';
import Scrollbars from '../../components/Common/Scrollbars';
import Breadcrumbs from '../../components/DataTree/Breadcrumbs/Breadcrumbs';
import { useObserver } from 'mobx-react-lite';
import { PathState } from '../../components/DataTree/path.state';
import Search from '../../components/DataTree/Search';
import DisplayTree from '../../components/DataTree/DisplayTree';
import DataSourceFormButton from '../../components/DataSource/Form/DataSourceFormButton';
import { Plus } from '../../icons';
import DataTreeModals from '../../components/DataTree/Modals/DataTreeModals';

export default function DataTree() {
  const { tree, openState } = useDataTreeForSidebar();
  const path = useObserver(() => PathState.path);

  return (
    <>
      <DataTreeModals />
      <div className="p-4 flex items-center">
        <Search />
        <DataSourceFormButton>
          {(toggle) => (
            <button className="w-6 h-6 ml-2 flex-center" onClick={toggle}>
              <Plus size={16} />
            </button>
          )}
        </DataSourceFormButton>
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
