import React from 'react';
import FormGroup, { FormGroupProps } from './FormGroup';
import Input, { InputProps } from './Input';

export default function InputGroup(
  props: Omit<FormGroupProps & InputProps, 'children'>,
) {
  return (
    <FormGroup {...props}>
      <Input {...props} />
    </FormGroup>
  );
}
