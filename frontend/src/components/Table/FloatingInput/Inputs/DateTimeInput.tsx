import React from 'react';
import { useTablePageContext } from '../../TablePage.context';
import { useResizeInput } from '../FloatingInput.utils';
import ToggleEmpty from '../ToggleRaw';
import cn from 'classnames';
import InputWrap from '../InputWrap';

export default function NumberInput() {
  const { floatingInputService: service } = useTablePageContext();
  const { dateTimeInputStore } = service;
  const { inputRef } = dateTimeInputStore;

  const { value, placeholder, isValid } = dateTimeInputStore.use(
    'value',
    'placeholder',
    'isValid',
  );

  const hidden = !service.use('isDateTime');

  useResizeInput(inputRef, hidden, value, placeholder);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    service.setValue(e.target.value);
  };

  return (
    <InputWrap hidden={hidden}>
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
      <ToggleEmpty />
    </InputWrap>
  );
}
