import React from 'react';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronDown,
  Sync,
  Plus,
  Minus,
  Undo,
  ListCheck,
  Upload,
} from 'icons';
import Menu from 'components/Common/Menu/Menu';
import MenuItem from 'components/Common/Menu/MenuItem';
import cn from 'classnames';
import { DataStore } from 'components/Table/data.store';
import { observer } from 'mobx-react-lite';
import { DataService } from 'components/Table/data.service';

const limits = [10, 25, 50, 100, 500, 1000, undefined];

export default observer(function ControlPanel({
  store,
  service,
}: {
  store: DataStore;
  service: DataService;
}) {
  const {
    count,
    queryParams: { offset, limit },
  } = store;

  const lastPageOffset =
    count === undefined || limit === undefined
      ? undefined
      : (Math.ceil(count / limit) - 1) * limit;

  const isPrevPageDisabled = offset === 0;

  const isNextPageDisabled =
    !lastPageOffset || undefined || offset >= lastPageOffset;

  return (
    <div className="flex items-center px-2 text-sm border-b border-dark-4">
      <button
        className={cn(
          'w-7 h-7 flex-center rounded hover:bg-lighter',
          isPrevPageDisabled && 'opacity-50',
        )}
        disabled={isPrevPageDisabled}
        onClick={() => service.setOffset(0)}
      >
        <ChevronsLeft size={20} />
      </button>
      <button
        className={cn(
          'w-7 h-7 flex-center rounded hover:bg-lighter',
          isPrevPageDisabled && 'opacity-50',
        )}
        disabled={isPrevPageDisabled}
        onClick={() => limit && service.setOffset(offset - limit)}
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex items-center mx-1">
        <Menu
          className="flex-shrink-0"
          button={(toggle) => (
            <button
              type="button"
              onClick={history.length > 0 ? toggle : undefined}
              className="flex items-center rounded hover:bg-lighter"
            >
              {limit === undefined ? 'All' : `${offset + 1}-${offset + limit}`}
              <ChevronDown size={16} />
            </button>
          )}
        >
          {(toggle) => (
            <>
              {limits.map((limit, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    toggle();
                    service.setLimit(limit);
                  }}
                >
                  {limit || 'All'}
                </MenuItem>
              ))}
            </>
          )}
        </Menu>
        of {count}
      </div>
      <button
        className={cn(
          'w-7 h-7 flex-center rounded hover:bg-lighter',
          isNextPageDisabled && 'opacity-50',
        )}
        disabled={isNextPageDisabled}
        onClick={() => limit && service.setOffset(offset + limit)}
      >
        <ChevronRight size={20} />
      </button>
      <button
        className={cn(
          'w-7 h-7 flex-center rounded hover:bg-lighter',
          isNextPageDisabled && 'opacity-50',
        )}
        disabled={isNextPageDisabled}
        onClick={() => lastPageOffset && service.setOffset(lastPageOffset)}
      >
        <ChevronsRight size={20} />
      </button>
      <button
        className="w-7 h-7 flex-center rounded hover:bg-lighter"
        onClick={() => service.sync()}
      >
        <Sync size={20} />
      </button>
      <button
        className="w-7 h-7 flex-center rounded hover:bg-lighter"
        onClick={() => service.addRow()}
      >
        <Plus size={20} />
      </button>
      <button className="w-7 h-7 flex-center rounded hover:bg-lighter">
        <Minus size={20} />
      </button>
      <button className="w-7 h-7 flex-center rounded hover:bg-lighter">
        <Undo size={20} />
      </button>
      <button className="w-7 h-7 flex-center rounded hover:bg-lighter">
        <ListCheck size={20} />
      </button>
      <button className="w-7 h-7 flex-center rounded hover:bg-lighter">
        <Upload size={20} />
      </button>
    </div>
  );
});
