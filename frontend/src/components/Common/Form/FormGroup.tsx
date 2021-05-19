import React from 'react';
import { Form } from 'lib/useForm';
import ErrorMessage from 'components/Common/Form/ErrorMessage';

export type FormGroupProps = {
  form: Form;
  name: string;
  label?: string;
  groupClassName?: string;
  errorClassName?: string;
  children: React.ReactNode;
};

export default function FormGroup({
  form,
  name,
  label,
  groupClassName,
  errorClassName,
  children,
}: FormGroupProps) {
  return (
    <label className={groupClassName || 'block'}>
      <div className="flex items-center">
        {label && <div className="w-28 flex-shrink-0">{label}:</div>}
        {children}
      </div>
      <ErrorMessage
        className={errorClassName}
        addClass={errorClassName === undefined ? 'pl-28' : undefined}
        form={form}
        name={name}
      />
    </label>
  );
}
