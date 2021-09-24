import React, { useRef } from 'react';
import { useTablePageContext } from '../../../TablePage.context';
import { useResizeInput } from '../../FloatingInput.utils';
import ToggleEmpty from '../../ToggleRaw';
import cn from 'classnames';
import InputWrap from '../../InputWrap';
import DateTimeControls from './DateTimeControls';

export default function NumberInput() {
  const { floatingInputService: service } = useTablePageContext();
  const { dateTimeInputStore } = service;
  const { inputRef } = dateTimeInputStore;
  const wrapRef = useRef<HTMLDivElement>(null);

  const { value, isRaw, placeholder, isValid } = dateTimeInputStore.use(
    'value',
    'isRaw',
    'placeholder',
    'isValid',
  );

  const hidden = !service.use('isDateTime');

  useResizeInput({ inputRef, hidden, value, placeholder, wrapRef });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    service.setValue(e.target.value);
  };

  return (
    <InputWrap ref={wrapRef} hidden={hidden} className="bg-dark-4 rounded">
      <input
        ref={inputRef}
        hidden={hidden}
        className={cn(
          'bg-dark-4 ring rounded-sm px-4 py-2.5 h-10 text-sm whitespace-nowrap overflow-hidden w-0 placeholder-light-9 block',
          !isValid && 'ring-error',
        )}
        onChange={onChange}
        placeholder={placeholder}
        value={value || ''}
      />
      <DateTimeControls />
      <ToggleEmpty isRaw={isRaw} setIsRaw={service.setIsRaw} />
    </InputWrap>
  );
}
