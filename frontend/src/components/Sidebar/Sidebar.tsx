import React from 'react';
import DataTree from 'components/DataTree/DataTree';
import { Logo } from 'icons';
import SidebarMenu from 'components/Sidebar/SidebarMenu';
import style from './style.module.css';
import { useResize, useTab } from 'components/Sidebar/sidebar.service';
import cn from 'classnames';
import QueriesTree from 'components/Query/QueriesTree/QueriesTree';

export default function Sidebar({ className }: { className?: string }) {
  const { ref, width, startResize, stopResize } = useResize();
  const [tab, setTab] = useTab();

  return (
    <>
      <div
        ref={ref}
        className={cn('h-full flex flex-col text-light-4', className)}
        style={{ width }}
      >
        <div className="p-4 pb-0 flex-shrink-0 bg-darker-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Logo size={26} className="mr-2 text-accent" />
              <b>DataFigata</b>
            </div>
            <SidebarMenu />
          </div>
          <div className="px-2 mt-4 flex text-center">
            <button
              className={cn(
                'w-full py-1 rounded-t mr-2',
                tab === 'data' ? 'bg-dark' : 'text-light-5 hover:text-light-4',
              )}
              onClick={() => setTab('data')}
            >
              Data
            </button>
            <button
              className={cn(
                'w-full py-1 rounded-t',
                tab === 'queries'
                  ? 'bg-dark'
                  : 'text-light-5 hover:text-light-4',
              )}
              onClick={() => setTab('queries')}
            >
              Queries
            </button>
          </div>
        </div>
        {tab === 'data' && <DataTree />}
        {tab === 'queries' && <QueriesTree />}
      </div>
      <div className="w-px bg-dark-3 relative user-select-none">
        <div
          onMouseDown={startResize}
          onMouseUp={stopResize}
          className={`absolute top-0 bottom-0 w-2 -left-1 ${style.resize}`}
        />
      </div>
    </>
  );
}
