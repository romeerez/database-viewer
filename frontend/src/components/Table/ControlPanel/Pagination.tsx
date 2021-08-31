import React from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from '../../../icons';
import Menu from '../../../components/Common/Menu/Menu';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import { useTablePageContext } from '../TablePage.context';
import cn from 'classnames';
import Tooltip from '../../../components/Common/Tooltip/Tooltip';
import { observer } from 'mobx-react-lite';
import { useKey } from 'react-use';
import { ConfirmLoosingChanges } from './ControlPanel';

const limits = [10, 25, 50, 100, 500, 1000, undefined];

export default observer(function Pagination({
  confirmLoosingChanges,
}: {
  confirmLoosingChanges: ConfirmLoosingChanges;
}) {
  const { tableDataService } = useTablePageContext();
  const count = tableDataService.getCount();
  const { offset, limit } = tableDataService.getQueryParams();

  const lastPageOffset =
    count === undefined || limit === undefined
      ? undefined
      : (Math.ceil(count / limit) - 1) * limit;

  const isPrevPageDisabled = offset === 0;

  const isNextPageDisabled =
    !lastPageOffset || undefined || offset >= lastPageOffset;

  const openFirstPage = confirmLoosingChanges(
    () => !isPrevPageDisabled && tableDataService.setOffset(0),
  );

  const openPreviousPage = confirmLoosingChanges(
    () =>
      !isPrevPageDisabled &&
      limit &&
      tableDataService.setOffset(offset - limit),
  );

  const openNextPage = confirmLoosingChanges(
    () =>
      !isNextPageDisabled &&
      limit &&
      tableDataService.setOffset(offset + limit),
  );

  const openLastPage = confirmLoosingChanges(
    () =>
      !isNextPageDisabled &&
      lastPageOffset &&
      tableDataService.setOffset(lastPageOffset),
  );

  useKey(
    'ArrowUp',
    (e) => {
      if (e.altKey) openPreviousPage();
    },
    {},
    [isPrevPageDisabled, limit],
  );

  useKey(
    'ArrowDown',
    (e) => {
      if (e.altKey) openNextPage();
    },
    {},
    [isNextPageDisabled, limit],
  );

  return (
    <>
      <Tooltip text="Fist page">
        <button
          className={cn(
            'w-8 h-8 flex-center rounded hover:bg-lighter',
            isPrevPageDisabled && 'opacity-50',
          )}
          disabled={isPrevPageDisabled}
          onClick={openFirstPage}
        >
          <ChevronsLeft size={20} />
        </button>
      </Tooltip>
      <Tooltip text="Previous page" hotkey="alt+up">
        <button
          className={cn(
            'w-8 h-8 flex-center rounded hover:bg-lighter',
            isPrevPageDisabled && 'opacity-50',
          )}
          disabled={isPrevPageDisabled}
          onClick={openPreviousPage}
        >
          <ChevronLeft size={20} />
        </button>
      </Tooltip>
      <div className="flex items-center mx-1 text-sm">
        <Menu
          tooltip="Change page size"
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
                  onClick={confirmLoosingChanges(() => {
                    toggle();
                    tableDataService.setLimit(limit);
                  })}
                >
                  {limit || 'All'}
                </MenuItem>
              ))}
            </>
          )}
        </Menu>
        of {count}
      </div>
      <Tooltip text="Next page" hotkey="alt+down">
        <button
          className={cn(
            'w-8 h-8 flex-center rounded hover:bg-lighter',
            isNextPageDisabled && 'opacity-50',
          )}
          disabled={isNextPageDisabled}
          onClick={openNextPage}
        >
          <ChevronRight size={20} />
        </button>
      </Tooltip>
      <Tooltip text="Last page">
        <button
          className={cn(
            'w-8 h-8 flex-center rounded hover:bg-lighter',
            isNextPageDisabled && 'opacity-50',
          )}
          disabled={isNextPageDisabled}
          onClick={openLastPage}
        >
          <ChevronsRight size={20} />
        </button>
      </Tooltip>
    </>
  );
});
