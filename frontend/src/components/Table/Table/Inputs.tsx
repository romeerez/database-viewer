import React, { RefObject, useEffect, useRef } from 'react';
import { DataStore } from 'components/Table/data.store';
import { DataService } from 'components/Table/data.service';
import Toggle from 'components/Common/Form/Toggle/Toggle';

const tdPaddingXPx = '32px';

export default function Inputs({
  store,
  service,
  tableRef,
}: {
  store: DataStore;
  service: DataService;
  tableRef: RefObject<HTMLTableElement>;
}) {
  const focusPrevRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const focusNextRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLTableCellElement>();
  const prevCellRef = useRef<HTMLTableCellElement>();
  const nextCellRef = useRef<HTMLTableCellElement>();
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const toggleEmptyRef = useRef<HTMLInputElement>(null);
  const toggleLabelRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.addEventListener('focus', onFocus, true);
    }

    if (toggleEmptyRef.current) {
      toggleEmptyRef.current.addEventListener('change', setPlaceholder);
    }
  }, []);

  const setPlaceholder = () => {
    const target = targetRef.current;
    const area = textAreaRef.current;
    const toggleEmpty = toggleEmptyRef.current;
    const { fields, defaults } = store;
    if (!target || !area || !toggleEmpty || !fields || !defaults) return;

    const column = +(target.dataset.columnIndex as string);
    area.placeholder = toggleEmpty.checked
      ? 'empty'
      : defaults[column] || (fields[column].isNullable ? 'null' : 'required');
  };

  const onFocus = (e: { target: EventTarget | null }) => {
    const target = e.target as HTMLTableCellElement;
    const area = textAreaRef.current;
    const focusPrev = focusPrevRef.current;
    const focusNext = focusNextRef.current;
    const { fields, defaults } = store;
    if (
      !area ||
      !focusPrev ||
      !focusNext ||
      !fields ||
      !defaults ||
      target.tagName !== 'TD'
    )
      return;

    cancelBlur();

    targetRef.current = target;

    let prev = target.previousElementSibling as HTMLTableCellElement | null;
    if (!prev || prev.tabIndex === -1) {
      prev = target.parentElement?.previousElementSibling
        ?.lastElementChild as HTMLTableCellElement | null;
    }
    prevCellRef.current = prev || undefined;

    let next = target.nextElementSibling as HTMLTableCellElement | null;
    if (!next) {
      next = target.parentElement?.nextElementSibling
        ?.children[1] as HTMLTableCellElement | null;
    }
    nextCellRef.current = next || undefined;

    const parent = area.parentElement as HTMLDivElement;
    parent.style.top = `${target.offsetTop}px`;
    parent.style.left = `${target.offsetLeft}px`;

    area.style.minWidth = `${target.offsetWidth}px`;
    area.style.minHeight = `${target.offsetHeight}px`;
    area.classList.remove((area.dataset as { bgClass: string }).bgClass);
    const bgClass = (target.dataset as { bgClass: string }).bgClass;
    area.classList.add(bgClass);
    (area.dataset as { bgClass: string }).bgClass = bgClass;

    parent.hidden = false;
    focusPrev.hidden = !prev;
    focusNext.hidden = !next;

    const { rowIndex, columnIndex } = target.dataset;
    const row = +(rowIndex as string);
    const column = +(columnIndex as string);
    area.value = service.getValue(row, column) || '';

    setPlaceholder();
    onChange({ target: area });
    area.focus();
  };

  let preventBlur = false;
  const onBlur = () => {
    if (preventBlur) return;

    const target = targetRef.current;
    const area = textAreaRef.current;
    const focusPrev = focusPrevRef.current;
    const focusNext = focusNextRef.current;
    const toggleEmpty = toggleEmptyRef.current;
    if (!area || !focusPrev || !focusNext || !target || !toggleEmpty) return;

    const { rowIndex, columnIndex } = target.dataset;
    const value = area.value;
    service.setValue(
      +(rowIndex as string),
      +(columnIndex as string),
      value || (toggleEmpty.checked ? '' : null),
    );

    blurTimeoutRef.current = setTimeout(() => {
      (area.parentElement as HTMLDivElement).hidden = true;
      focusPrev.hidden = true;
      focusNext.hidden = true;
    }, 50);
  };

  const onChange = (e: { target: HTMLTextAreaElement }) => {
    const el = e.target;
    el.style.width = '0';
    el.style.height = '0';
    el.style.paddingLeft = tdPaddingXPx;
    el.style.width = `${e.target.scrollWidth}px`;
    el.style.height = `${e.target.scrollHeight}px`;
    el.style.paddingLeft = '';

    const toggleLabel = toggleLabelRef.current;
    const toggleInput = toggleEmptyRef.current;
    if (!toggleLabel || !toggleInput) return;

    if (e.target.value.length === 0) {
      toggleLabel.classList.remove('-translate-y-2', 'opacity-0');
      toggleInput.hidden = false;
    } else {
      toggleLabel.classList.add('-translate-y-2', 'opacity-0');
    }
  };

  const cancelBlur = () => {
    const timeout = blurTimeoutRef?.current;
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  const focusPrev = (e: React.FocusEvent) => {
    cancelBlur();
    const prev = prevCellRef.current;
    if (prev) {
      e.preventDefault();
      onFocus({ target: prev });
    }
  };

  const focusNext = (e: React.FocusEvent) => {
    cancelBlur();
    const next = nextCellRef.current;
    if (next) {
      e.preventDefault();
      onFocus({ target: next });
    }
  };

  const onLabelTransitionEnd = () => {
    const label = toggleLabelRef.current;
    const input = toggleEmptyRef.current;
    if (!label || !input || !label.classList.contains('opacity-0')) return;
    input.hidden = true;
  };

  return (
    <>
      <div ref={focusPrevRef} hidden tabIndex={0} onFocus={focusPrev} />
      <div className="absolute flex flex-col items-start" hidden>
        <textarea
          ref={textAreaRef}
          className="ring rounded-sm px-4 py-2.5 text-sm whitespace-nowrap overflow-hidden w-0 h-0 placeholder-light-9 block"
          onChange={onChange}
          onBlur={onBlur}
        />
        <label
          ref={toggleLabelRef}
          className="flex items-center text-sm bg-dark-4 py-2 px-4 rounded-b select-none duration-200 transform opacity-0 -translate-y-2"
          onTransitionEnd={onLabelTransitionEnd}
          onMouseDown={() => (preventBlur = true)}
          onMouseUp={() => (preventBlur = false)}
        >
          null
          <Toggle
            inputProps={{ ref: toggleEmptyRef, onFocus: cancelBlur }}
            className="mx-2"
          />
          empty
        </label>
      </div>
      <div ref={focusNextRef} hidden tabIndex={0} onFocus={focusNext} />
    </>
  );
}
