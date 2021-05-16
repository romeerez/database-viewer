import React, { useRef, useState } from 'react';
import cx from 'clsx';
import DataTree from 'components/DataTree/DataTree';
import { Logo } from 'icons';
import Scrollbars from 'components/Common/Scrollbars';
import Search from 'components/DataTree/Search';
import SidebarMenu from 'components/Sidebar/SidebarMenu';
import style from './style.module.css';

const minWidth = 250;
const defaultWidth = 300;
const widthKey = 'sidebar.width';

export default function Sidebar({ className }: { className?: string }) {
  const width = window.localStorage.getItem(widthKey) || `${defaultWidth}px`;
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [listenerRef] = useState<{ current?: (e: MouseEvent) => void }>({
    current: undefined,
  });

  const startResize = (e: React.MouseEvent) => {
    const { current: sidebar } = sidebarRef;
    if (!sidebar) return;

    if (listenerRef.current)
      document.removeEventListener('mousemove', listenerRef.current);

    const initialWidth = sidebar.offsetWidth;
    const initialX = e.clientX;

    listenerRef.current = (e) => {
      sidebar.style.width = `${Math.max(
        minWidth,
        initialWidth + e.clientX - initialX,
      )}px`;
    };

    document.addEventListener('mousemove', listenerRef.current);
  };

  const stopResize = () => {
    if (!sidebarRef.current || !listenerRef.current) return;

    document.removeEventListener('mousemove', listenerRef.current);

    window.localStorage.setItem(widthKey, sidebarRef.current.style.width);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={cx('h-full flex flex-col text-light-4', className)}
        style={{ width }}
      >
        <div className="p-4 flex-shrink-0 bg-darker-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Logo size={26} className="mr-2 text-accent" />
              <b>DataFigata</b>
            </div>
            <SidebarMenu />
          </div>
          <div className="px-2">
            <Search />
          </div>
        </div>
        <Scrollbars>
          <div className="p-4 pt-0 inline-block min-w-full">
            <DataTree />
          </div>
        </Scrollbars>
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
