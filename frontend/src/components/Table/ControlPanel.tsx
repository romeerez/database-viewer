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
import { TableState } from 'components/Table/table.service';
import MenuItem from 'components/Common/Menu/MenuItem';
import cn from 'classnames';

const limits = [10, 25, 50, 100, 500, 1000, undefined];

export default function ControlPanel({ state }: { state: TableState }) {
  const { offset, limit, count } = state.state;

  const lastPageOffset =
    count === undefined || limit === undefined
      ? undefined
      : (Math.ceil(count / limit) - 1) * limit;
  const isPrevPageDisabled = offset === 0;
  const isNextPageDisabled =
    !lastPageOffset || undefined || offset >= lastPageOffset;

  return (
    <div className="flex items-center px-2 text-sm">
      <button
        className={cn(
          'w-7 h-7 flex-center rounded hover:bg-lighter',
          isPrevPageDisabled && 'opacity-50',
        )}
        disabled={isPrevPageDisabled}
        onClick={() => state.setOffset(0)}
      >
        <ChevronsLeft size={20} />
      </button>
      <button
        className={cn(
          'w-7 h-7 flex-center rounded hover:bg-lighter',
          isPrevPageDisabled && 'opacity-50',
        )}
        disabled={isPrevPageDisabled}
        onClick={() => limit && state.setOffset(offset - limit)}
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
                    state.setLimit(limit);
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
        onClick={() => limit && state.setOffset(offset + limit)}
      >
        <ChevronRight size={20} />
      </button>
      <button
        className={cn(
          'w-7 h-7 flex-center rounded hover:bg-lighter',
          isNextPageDisabled && 'opacity-50',
        )}
        disabled={isNextPageDisabled}
        onClick={() => lastPageOffset && state.setOffset(lastPageOffset)}
      >
        <ChevronsRight size={20} />
      </button>
      <button
        className="w-7 h-7 flex-center rounded hover:bg-lighter"
        onClick={() => state.reload()}
      >
        <Sync size={20} />
      </button>
      <button className="w-7 h-7 flex-center rounded hover:bg-lighter">
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
}
