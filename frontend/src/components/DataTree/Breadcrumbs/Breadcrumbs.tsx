import React from 'react';
import style from './style.module.css';
import cn from 'classnames';
import { PathState } from 'components/DataTree/path.state';
import { useObserver } from 'mobx-react-lite';

export default function Breadcrumbs() {
  const path = ['all', ...useObserver(() => PathState.path)];
  const last = path.length - 1;

  return (
    <div className="h-12 pt-3 pb-3 bg-dark-2 sticky top-0 z-20">
      <div className="flex">
        {path.length > 1 &&
          path.map((item, i) => (
            <button
              key={i}
              className={cn(
                'bg-dark-5 h-6 px-2 flex items-center text-sm text-light-4 relative shadow-md hover:bg-dark-6',
                i === 0 ? 'rounded-l' : 'ml-3',
                style.group,
              )}
              style={{
                zIndex: last - i,
              }}
              onClick={() => PathState.setPath(path.slice(1, i + 1))}
            >
              {i !== 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-2 overflow-hidden -ml-2">
                  <div className={style.before} />
                </div>
              )}
              {item}
              <div className="absolute left-full top-0 bottom-0 w-2 overflow-hidden">
                <div className={style.after} />
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
