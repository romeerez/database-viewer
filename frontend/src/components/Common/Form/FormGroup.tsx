import React from 'react';
import { Form } from 'lib/useForm';
import ErrorMessage from 'components/Common/Form/ErrorMessage';

export type FormGroupProps = {
  form: Form;
  name: string;
  label: string;
  children: React.ReactNode;
};

export default function FormGroup({
  label,
  form,
  name,
  children,
}: FormGroupProps) {
  return (
    <label className="block">
      <div className="flex items-center">
        <div className="w-28 flex-shrink-0">{label}:</div>
        {children}
      </div>
      <ErrorMessage addClass="pl-28" form={form} name={name} />
    </label>
  );
}
