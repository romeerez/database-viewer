import React from 'react';
import { useTablePageContext } from '../../TablePage.context';
import { useResizeInput } from '../FloatingInput.utils';
import InputWrap from '../InputWrap';
import Toggle from '../../../Common/Form/Toggle/Toggle';

export default function BooleanInput() {
  const { floatingInputService: service } = useTablePageContext();
  const { booleanInputStore } = service;
  const { inputRef } = booleanInputStore;
  const cell = service.use('cell');
  const { value, isRaw, placeholder } = booleanInputStore.use(
    'value',
    'isRaw',
    'placeholder',
  );
  const hidden = !service.use('isBoolean');

  useResizeInput({
    inputRef,
    hidden,
    value,
    placeholder,
    minWidth: cell?.minWidth,
  });

  const onChange = (value: string) => {
    service.setValue(value);
  };

  return (
    <InputWrap hidden={hidden}>
      <label
        ref={inputRef}
        className="flex items-center text-sm bg-dark-4 py-2 px-4 rounded-b select-none duration-200 transform"
      >
        true
        <Toggle
          inputProps={{
            onChange(e) {
              onChange(e.target.checked ? 'false' : 'true');
            },
          }}
          className="mx-2"
          checked={value !== 'true'}
        />
        false
      </label>
    </InputWrap>
  );
}
