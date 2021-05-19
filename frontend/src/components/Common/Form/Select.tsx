import React from 'react';
import Menu from 'components/Common/Menu/Menu';
import MenuItem from 'components/Common/Menu/MenuItem';

export type Option = {
  label?: React.ReactNode;
  text?: string;
  value: string;
};

const menuClassId = 'select-menu';

const isLowerIncludes = (target: string, lower: string) =>
  target.toLocaleLowerCase().includes(lower);

const isOptionMatchingValue = ({ label, text, value }: Option, lower: string) =>
  (typeof label === 'string' ? isLowerIncludes(label, lower) : false) ||
  (text ? isLowerIncludes(text, lower) : false) ||
  isLowerIncludes(value, lower);

export default function Select({
  value,
  setValue,
  formRef,
  options,
  filter,
  input,
}: {
  value: string;
  setValue(value: string): void;
  formRef: { current: HTMLFormElement | null };
  options?: Option[];
  filter?: boolean;
  input(params: {
    ref: React.RefObject<HTMLInputElement>;
    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void;
    onFocus(): void;
    onClick(): void;
    onBlur(e: React.SyntheticEvent): void;
  }): React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const onFocus = () => setOpen(true);

  const onBlur = (e: React.SyntheticEvent) => {
    const el = (e.nativeEvent as unknown as { relatedTarget: HTMLElement })
      .relatedTarget;

    if (el?.closest(`.${menuClassId}`)) return;
    setOpen(false);
  };

  const inputRef = React.useRef<HTMLInputElement>(null);
  const refs = React.useRef<HTMLButtonElement[]>([]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      refs.current[0]?.focus();
    } else if (e.key === 'ArrowUp') {
      refs.current[refs.current.length - 1]?.focus();
    }
  };

  const setButtonRef = (el: HTMLButtonElement | null) => {
    if (!el) return;
    if (refs.current.length === options?.length) refs.current.length = 0;
    refs.current.push(el);
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

    const current = e.target as HTMLButtonElement;
    const index = refs.current.indexOf(current);
    if (index === -1) return;

    let toFocus: HTMLButtonElement | HTMLInputElement | null =
      refs.current[down ? index + 1 : index - 1];

    if (!toFocus) toFocus = inputRef.current;

    if (toFocus) toFocus.focus();
  };

  const onOptionSelect = (e: React.SyntheticEvent) => {
    const el = e.target as HTMLButtonElement;
    setValue(el.value);
    setOpen(false);

    const formElement = formRef.current;
    const inputElement = inputRef.current;
    if (!formElement || !inputElement) return;

    const lastButtonIndex = Array.prototype.indexOf.call(
      formElement.elements,
      refs.current[refs.current.length - 1],
    );
    if (lastButtonIndex === -1) return;

    const nextInput = formElement.elements[lastButtonIndex + 1] as HTMLElement;
    if (nextInput) nextInput.focus();
  };

  const lowerValue = value?.toLocaleLowerCase();
  let processedOptions: Option[] | undefined;

  if (!lowerValue) processedOptions = options;

  if (!value) {
    processedOptions = options;
  }
  if (filter) {
    processedOptions = options?.filter((option) =>
      isOptionMatchingValue(option, lowerValue),
    );
  } else {
    processedOptions = options?.sort((option) =>
      isOptionMatchingValue(option, value) ? -1 : 0,
    );
  }

  return (
    <Menu
      open={open}
      setOpen={setOpen}
      className={menuClassId}
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
        <>
          {processedOptions?.map(({ label, value }) => (
            <MenuItem
              key={value}
              buttonRef={setButtonRef}
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
        </>
      )}
    </Menu>
  );
}
