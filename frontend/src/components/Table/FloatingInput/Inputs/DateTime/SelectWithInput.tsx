import React from 'react';
import Select, { Option } from '../../../../Common/Form/Select';
import Input from '../../../../Common/Form/Input';
import { CaretDown } from '../../../../../icons';
import cn from 'classnames';

export default function SelectWithInput({
  value,
  setValue,
  selectValue = setValue,
  options,
  widthClassName = 'w-12',
}: {
  value: string;
  setValue(value: string): void;
  selectValue?(value: string): void;
  options: Option[];
  widthClassName?: string;
}) {
  return (
    <Select
      value={value}
      setValue={selectValue}
      options={options}
      input={({ ref, ...props }) => (
        <div className="relative">
          <Input
            inputRef={ref}
            {...props}
            className={cn(
              'h-8 pl-2 pr-5 bg-dark-5 rounded border-b-2 border-dark-5 focus:border-accent transition duration-200',
              widthClassName,
            )}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <CaretDown
            size={16}
            className="absolute top-2 right-1 text-light-9"
          />
        </div>
      )}
    />
  );
}
