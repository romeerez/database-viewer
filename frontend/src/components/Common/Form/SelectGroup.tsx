import React from 'react';
import Input from 'components/Common/Form/Input';
import { Form } from 'lib/useForm';
import { useWatch } from 'react-hook-form';
import FormGroup from 'components/Common/Form/FormGroup';
import Select from './Select';

export type Option = {
  label?: React.ReactNode;
  value: string;
};

export default function SelectGroup({
  form,
  name,
  autoFocus,
  label,
  options,
  filter,
}: {
  form: Form;
  name: string;
  autoFocus?: boolean;
  label: string;
  options?: Option[];
  filter?: boolean;
}) {
  const value = useWatch({
    control: form.control,
    name,
  }) as string;

  return (
    <FormGroup form={form} name={name} label={label}>
      <Select
        value={value}
        setValue={(value) => form.setValue(name, value)}
        options={options}
        filter={filter}
        input={({ ref, ...props }) => (
          <Input
            autoComplete="off"
            inputRef={(input) => {
              form.register(input);
              (
                ref as {
                  current: HTMLInputElement | null;
                }
              ).current = input;
            }}
            name={name}
            autoFocus={autoFocus}
            {...props}
          />
        )}
      />
    </FormGroup>
  );
}
