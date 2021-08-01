import React from 'react';
import { ExpandAlt, Window, Minus } from '../../icons';

import cn from 'classnames';
import { PanelState } from '../../components/Sidebar/sidebar.service';

export default function SidebarPanel({
  elementRef,
  title,
  children,
  height,
  state,
  minimize,
  maximize,
  normalize,
  ...props
}: {
  elementRef?: React.RefObject<HTMLDivElement>;
  height?: string;
  state: PanelState;
  minimize(): void;
  maximize(): void;
  normalize(): void;
  title: string;
} & React.InputHTMLAttributes<HTMLDivElement>) {
  const style =
    state === 'min'
      ? { height: '50px', overflow: 'hidden', flexShrink: 0 }
      : state === 'max'
      ? { height: '100%' }
      : { height };

  return (
    <div
      ref={elementRef}
      style={style}
      {...props}
      className={cn('flex flex-col', height ? 'flex-shrink-0' : 'flex-grow')}
    >
      <div className="pt-3 pb-1 px-4 bg-dark-2 flex items-center justify-between">
        {title}
        <div className="flex items-center">
          <button className="rounded opacity-70 duration-300 transition hover:opacity-100 hover:bg-darker-5 flex-center w-5 h-5 mr-3">
            {state === 'min' ? (
              <Window size={16} onClick={normalize} />
            ) : (
              <Minus size={16} onClick={minimize} />
            )}
          </button>
          <button className="rounded opacity-70 duration-300 transition hover:opacity-100 hover:bg-darker-5 flex-center w-5 h-5">
            {state === 'max' ? (
              <Window size={16} onClick={normalize} />
            ) : (
              <ExpandAlt size={16} onClick={maximize} />
            )}
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
