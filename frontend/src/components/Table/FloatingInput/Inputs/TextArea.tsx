import React from 'react';
import { useTablePageContext } from '../../TablePage.context';
import { useResizeInput } from '../FloatingInput.utils';
import ToggleEmpty from '../ToggleRaw';
import InputWrap from '../InputWrap';

export default function TextArea() {
  const { floatingInputService: service } = useTablePageContext();
  const { textAreaStore } = service;
  const { inputRef } = textAreaStore;
  const { value, isRaw, placeholder } = textAreaStore.use(
    'value',
    'isRaw',
    'placeholder',
  );
  const hidden = !service.use('isText');

  useResizeInput(inputRef, hidden, value, placeholder, true);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const el = e.target as HTMLTextAreaElement;
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      const position = el.selectionEnd;
      el.value =
        el.value.substring(0, position) + '\n' + el.value.substring(position);
      el.selectionEnd = position + 1;
      service.setValue(el.value);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    service.setValue(e.target.value);
  };

  return (
    <InputWrap hidden={hidden}>
      <textarea
        ref={inputRef}
        hidden={hidden}
        className="bg-dark-4 ring rounded-sm px-4 py-2.5 text-sm whitespace-nowrap overflow-hidden w-0 h-0 placeholder-light-9 block resize-none"
        onKeyDown={onKeyDown}
        onChange={onChange}
        placeholder={placeholder}
        value={value || ''}
      />
      <ToggleEmpty isRaw={isRaw} setIsRaw={service.setIsRaw} />
    </InputWrap>
  );
}
