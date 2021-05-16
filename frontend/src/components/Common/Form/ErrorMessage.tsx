import React from 'react';
import { ErrorMessage as OriginalErrorMessage } from '@hookform/error-message';
import cn from 'clsx';
import { Form } from 'lib/useForm';

export default function ErrorMessage({
  form,
  name,
  className = 'text-error text-sm mt-2',
  addClass,
}: {
  form: Form;
  name: string;
  className?: string;
  addClass?: string;
}) {
  return (
    <OriginalErrorMessage
      errors={form.errors}
      name={name}
      render={(error) => (
        <div className={cn(className, addClass)}>{error.message}</div>
      )}
    />
  );
}
