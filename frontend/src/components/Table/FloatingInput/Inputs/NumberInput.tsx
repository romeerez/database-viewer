import React from 'react';
import { useTablePageContext } from '../../TablePage.context';
import { useResizeInput } from '../FloatingInput.utils';
import ToggleEmpty from '../ToggleRaw';
import cn from 'classnames';
import InputWrap from '../InputWrap';

export default function NumberInput() {
  const { floatingInputService: service } = useTablePageContext();
  const { numberInputStore } = service;
  const { inputRef } = numberInputStore;

  const { value, isRaw, placeholder, isValid } = numberInputStore.use(
    'value',
    'isRaw',
    'placeholder',
    'isValid',
  );

  const hidden = !service.use('isNumber');

  useResizeInput(inputRef, hidden, value, placeholder);

  return (
    <InputWrap hidden={hidden}>
      <input
        ref={inputRef}
        hidden={hidden}
        className={cn(
          'bg-dark-4 ring rounded-sm px-4 py-2.5 text-sm whitespace-nowrap overflow-hidden w-0 h-0 placeholder-light-9 block resize-none text-right',
          !isValid && 'ring-error',
        )}
        onChange={(e) => service.setValue(e.target.value)}
        placeholder={placeholder}
        value={value || ''}
      />
      <ToggleEmpty isRaw={isRaw} setIsRaw={service.setIsRaw} />
    </InputWrap>
  );
}
