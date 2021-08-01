import React, { ReactNode, useRef } from 'react';
import { useTablePageContext } from 'components/Table/TablePage.context';
import { observer } from 'mobx-react-lite';
import ToggleEmpty from 'components/Table/FloatingInput/ToggleEmpty';
import TextArea from 'components/Table/FloatingInput/TextArea';

export default observer(function FloatingInput({
  children,
}: {
  children: ReactNode;
}) {
  const { floatingInputService } = useTablePageContext();

  const onInputsWrapMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onFocus = (e: { target: EventTarget | null }) => {
    const target = e.target as HTMLTableCellElement;
    if (target.tagName !== 'TD') return;

    const { rowIndex, columnIndex } = target.dataset;
    const row = +(rowIndex as string);
    const column = +(columnIndex as string);

    let prev = target.previousElementSibling as HTMLTableCellElement | null;
    if (!prev || prev.tabIndex === -1) {
      prev = target.parentElement?.previousElementSibling
        ?.lastElementChild as HTMLTableCellElement | null;
    }

    let next = target.nextElementSibling as HTMLTableCellElement | null;
    if (!next) {
      next = target.parentElement?.nextElementSibling
        ?.children[1] as HTMLTableCellElement | null;
    }

    floatingInputService.setCell({
      row,
      column,
      offsetTop: target.offsetTop,
      offsetLeft: target.offsetLeft,
      minWidth: target.offsetWidth,
      minHeight: target.offsetHeight,
      className: (target.dataset as { bgClass: string }).bgClass,
      prevElement: prev || undefined,
      nextElement: next || undefined,
    });
  };

  const focusPrev = (e: React.FocusEvent) => {
    floatingInputService.cancelBlur();
    const prev = floatingInputService.getCell()?.prevElement;
    if (prev) {
      e.preventDefault();
      onFocus({ target: prev });
    }
  };

  const focusNext = (e: React.FocusEvent) => {
    floatingInputService.cancelBlur();
    const next = floatingInputService.getCell()?.nextElement;
    if (next) {
      e.preventDefault();
      onFocus({ target: next });
    }
  };

  const hideInputs = !floatingInputService.getShowInputs();
  const cell = floatingInputService.getCell();

  return (
    <div onFocusCapture={onFocus}>
      {children}
      <div onMouseDownCapture={onInputsWrapMouseDown}>
        <div
          hidden={hideInputs || !cell?.prevElement}
          tabIndex={0}
          onFocus={focusPrev}
        />
        <div
          className="absolute flex flex-col items-start"
          hidden={hideInputs}
          style={{
            top: cell && `${cell.offsetTop}px`,
            left: cell && `${cell.offsetLeft}px`,
          }}
        >
          <TextArea />
          <ToggleEmpty />
        </div>
        <div
          hidden={hideInputs || !cell?.nextElement}
          tabIndex={0}
          onFocus={focusNext}
        />
      </div>
    </div>
  );
});
