import React, { ReactNode } from 'react';
import Appear from '../../../components/Common/Appear/Appear';
import {
  ChevronRight,
  DotsHorizontalRounded,
  RightArrowAlt,
} from '../../../icons';
import cn from 'classnames';
import Menu from '../../../components/Common/Menu/Menu';
import { Link, useRouteMatch } from 'react-router-dom';
import { useDataTreeServerContext } from '../server.context';
import { useDataTreeContext } from '../dataTree.context';

export default function TreeItem({
  open,
  setOpen,
  className,
  buttonStyle,
  icon,
  name,
  title,
  menu,
  openTree,
  paddingLeft,
  to,
  children,
}: {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  className?: string;
  buttonStyle: React.CSSProperties;
  icon: (routeMatch: boolean) => React.ReactNode;
  name: string;
  title(name: React.ReactNode): React.ReactNode;
  menu?: (toggle: () => void) => React.ReactNode;
  openTree?: () => void;
  paddingLeft: number;
  to?: string;
  children?: React.ReactNode;
}) {
  const openSubTree = setOpen && (() => setOpen(true));
  const close = setOpen && (() => setOpen(false));
  const toggle = setOpen && (() => setOpen(!open));

  const routeMatch = useRouteMatch({ path: to, exact: true });
  const { openService } = useDataTreeServerContext();
  const animateClose = openService.useAnimateClose();
  const { searchService } = useDataTreeContext();
  const search = searchService.useLowerSearch();

  let nameWithMatch: ReactNode | undefined;
  if (search) {
    const index = name.toLocaleLowerCase().indexOf(search);
    if (index !== -1) {
      const len = search.length;
      nameWithMatch = (
        <>
          {name.slice(0, index)}
          <span className="text-yellow-1 underline">
            {name.slice(index, index + len)}
          </span>
          {name.slice(index + len)}
        </>
      );
    }
  }

  const titleContent = title(nameWithMatch || name);

  return (
    <div className={className}>
      <div
        className="flex sticky bg-dark-2 hover:bg-dark-3 rounded group"
        style={buttonStyle}
      >
        <div className={cn('h-8 min-w-full flex items-center rounded')}>
          {setOpen && (
            <button
              className="group-hover:bg-lighter rounded ml-px"
              onClick={toggle}
            >
              <div
                className="py-1 pr-1 h-8 flex-center rounded hover:bg-lighter"
                style={{ paddingLeft: `${paddingLeft}px` }}
              >
                <ChevronRight
                  size={18}
                  className={cn(
                    'mr-1 text-light-5',
                    open ? 'transform rotate-90' : 'transform rotate-0',
                  )}
                />
              </div>
            </button>
          )}
          {to && (
            <Link
              to={to}
              className={cn(
                'flex-grow py-1 pr-2 pl-0 duration-300 transition-all group-hover:pl-2 flex items-center',
                routeMatch && 'bg-accent-dark pl-2',
              )}
            >
              {icon(!!routeMatch)}
              {titleContent}
            </Link>
          )}
          {!to && (
            <div
              style={setOpen ? undefined : { paddingLeft: `${paddingLeft}px` }}
            >
              <div className="flex-grow py-1 pr-2 pl-0 duration-300 transition-all group-hover:pl-2 flex items-center whitespace-nowrap">
                {icon(!!routeMatch)}
                {titleContent}
              </div>
            </div>
          )}
        </div>
        <div className="sticky right-16 self-end h-0 opacity-0 group-hover:opacity-100">
          <div className="absolute h-8 py-1 bottom-0 bg-dark-3 text-light-5 hidden group-hover:flex items-center justify-center">
            {menu && (
              <Menu
                button={(toggle) => (
                  <button
                    className="h-6 w-6 -left-4 flex-center hover:text-light-2"
                    onClick={toggle}
                  >
                    <DotsHorizontalRounded size={16} />
                  </button>
                )}
              >
                {menu}
              </Menu>
            )}
            {openTree && (
              <button
                className="rounded h-6 w-6 ml-1 flex-center hover:text-light-2"
                onClick={() => {
                  openSubTree?.();
                  openTree?.();
                }}
              >
                <RightArrowAlt size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      {open !== undefined && close && (
        <Appear open={open} onClose={close} animateClose={animateClose}>
          {children}
        </Appear>
      )}
    </div>
  );
}
