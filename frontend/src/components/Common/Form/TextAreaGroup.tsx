import React from 'react';
import FormGroup, { FormGroupProps } from './FormGroup';
import TextArea, { TextAreaProps } from './TextArea';

export default function TextAreaGroup(
  props: Omit<FormGroupProps & TextAreaProps, 'children'>,
) {
  return (
    <FormGroup {...props}>
      <TextArea {...props} />
    </FormGroup>
  );
}
