import React, { useRef } from 'react';
import Menu from '../../../components/Common/Menu/Menu';
import MenuItem from '../../../components/Common/Menu/MenuItem';
import cn from 'classnames';

export type Option = {
  label?: React.ReactNode;
  text?: string;
  value: string;
};

const isLowerIncludes = (target: string, lower: string) =>
  target.toLocaleLowerCase().includes(lower);

const isOptionMatchingValue = ({ label, text, value }: Option, lower: string) =>
  (typeof label === 'string' ? isLowerIncludes(label, lower) : false) ||
  (text ? isLowerIncludes(text, lower) : false) ||
  isLowerIncludes(value, lower);

export default function Select({
  value,
  setValue,
  options,
  filter,
  sort,
  maxHeightClass = 'max-h-80',
  input,
}: {
  value: string;
  setValue(value: string): void;
  options?: Option[];
  filter?: boolean;
  sort?: boolean;
  maxHeightClass?: string;
  input(params: {
    ref: React.RefObject<HTMLInputElement>;
    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void;
    onFocus(): void;
    onClick(): void;
    onBlur(e: React.SyntheticEvent): void;
  }): React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  const onFocus = () => setOpen(true);

  const onBlur = (e: React.SyntheticEvent) => {
    const el = (e.nativeEvent as unknown as { relatedTarget: HTMLElement })
      .relatedTarget;

    if (wrapRef.current?.contains(el)) return;
    setOpen(false);
  };

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const list = listRef.current as HTMLDivElement;
    let button;
    if (e.key === 'ArrowDown') {
      button = list.firstElementChild as HTMLButtonElement | null;
    } else if (e.key === 'ArrowUp') {
      button = list.lastElementChild as HTMLButtonElement | null;
    }
    button?.focus();
  };

  const onOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onOptionSelect(e);
      return;
    }

    const down = e.key === 'ArrowDown';
    const up = e.key === 'ArrowUp';
    if (!down && !up) return;

    e.preventDefault();

    const current = e.target as HTMLButtonElement;
    const toFocus =
      (current[
        down ? 'nextElementSibling' : 'previousElementSibling'
      ] as HTMLButtonElement) || inputRef.current;

    toFocus?.focus();
  };

  const onOptionSelect = (e: React.SyntheticEvent) => {
    const el = e.target as HTMLButtonElement;
    setValue(el.value);
    setOpen(false);
  };

  const lowerValue = value?.toLocaleLowerCase();
  let processedOptions: Option[] | undefined;

  if (!lowerValue) processedOptions = options;

  if (!value) {
    processedOptions = options;
  } else if (filter) {
    processedOptions = options?.filter((option) =>
      isOptionMatchingValue(option, lowerValue),
    );
  } else if (sort) {
    processedOptions = options?.sort((option) =>
      isOptionMatchingValue(option, value) ? -1 : 0,
    );
  } else {
    processedOptions = options;
  }

  return (
    <div ref={wrapRef}>
      <Menu
        open={open}
        setOpen={setOpen}
        menuClass="mt-1"
        button={() =>
          input({
            ref: inputRef,
            onKeyDown: onInputKeyDown,
            onFocus,
            onClick: onFocus,
            onBlur,
          })
        }
      >
        {() => (
          <div
            ref={listRef}
            className={cn('overflow-auto bg-dark-3 space-y-px', maxHeightClass)}
          >
            {processedOptions?.map(({ label, value }) => (
              <MenuItem
                key={value}
                onKeyDown={onOptionKeyDown}
                onClick={onOptionSelect}
                onFocus={onFocus}
                onBlur={onBlur}
                value={value}
                tabIndex={-1}
              >
                {label || value}
              </MenuItem>
            ))}
          </div>
        )}
      </Menu>
    </div>
  );
}
