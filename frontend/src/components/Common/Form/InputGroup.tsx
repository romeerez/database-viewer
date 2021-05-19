import React from 'react';
import FormGroup, { FormGroupProps } from './FormGroup';
import Input, { InputProps } from './Input';

export default function InputGroup({
  form,
  name,
  label,
  groupClassName,
  errorClassName,
  ...inputProps
}: Omit<FormGroupProps & InputProps, 'children'>) {
  return (
    <FormGroup
      form={form}
      name={name}
      label={label}
      groupClassName={groupClassName}
      errorClassName={errorClassName}
    >
      <Input {...inputProps} form={form} name={name} />
    </FormGroup>
  );
}
