import React from 'react';
import DataTree from 'components/DataTree/DataTree';
import { Logo } from 'icons';
import SidebarMenu from 'components/Sidebar/SidebarMenu';
import style from './style.module.css';
import {
  useResizeSidebar,
  useResizeQueries,
  useQueriesPanelState,
} from 'components/Sidebar/sidebar.service';
import cn from 'classnames';
import QueriesTree from 'components/Query/QueriesTree/QueriesTree';
import SidebarPanel from 'components/Sidebar/SidebarPanel';

export default function Sidebar({ className }: { className?: string }) {
  const resizeSidebar = useResizeSidebar();
  const resizeQueries = useResizeQueries();
  const queriesPanelState = useQueriesPanelState();

  return (
    <>
      <div
        ref={resizeSidebar.ref}
        className={cn('h-full flex flex-col text-light-4', className)}
        style={{ width: resizeSidebar.size }}
      >
        <div className="p-4 pb-0 flex-shrink-0 bg-darker-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Logo size={26} className="mr-2 text-accent" />
              <b>DataFigata</b>
            </div>
            <SidebarMenu />
          </div>
        </div>
        <div className="flex-grow flex flex-col">
          <SidebarPanel
            title="Data"
            state={
              queriesPanelState.state === 'min'
                ? 'max'
                : queriesPanelState.state === 'max'
                ? 'min'
                : 'normal'
            }
            minimize={queriesPanelState.maximize}
            maximize={queriesPanelState.maximize}
            normalize={queriesPanelState.minimize}
          >
            <DataTree />
          </SidebarPanel>
          <div className="h-px bg-dark-4 relative user-select-none">
            <div
              onMouseDown={resizeQueries.startResize}
              onMouseUp={resizeQueries.stopResize}
              className={`absolute left-0 right-0 h-2 -top-1 ${style.resizeHorizontal}`}
            />
          </div>
          <SidebarPanel
            elementRef={resizeQueries.ref}
            height={resizeQueries.size}
            title="Queries"
            state={queriesPanelState.state}
            minimize={queriesPanelState.minimize}
            maximize={queriesPanelState.maximize}
            normalize={queriesPanelState.normalize}
          >
            <QueriesTree />
          </SidebarPanel>
        </div>
      </div>
      <div className="w-px bg-dark-4 relative user-select-none">
        <div
          onMouseDown={resizeSidebar.startResize}
          onMouseUp={resizeSidebar.stopResize}
          className={`absolute top-0 bottom-0 w-2 -left-1 ${style.resizeVertical}`}
        />
      </div>
    </>
  );
}
