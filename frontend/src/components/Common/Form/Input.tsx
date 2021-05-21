import React from 'react';
import { Form } from 'lib/useForm';

export type InputProps = {
  form?: Form;
  width?: string;
  inputRef?:
    | ((input: HTMLInputElement | null) => void)
    | React.MutableRefObject<HTMLInputElement | null>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'>;

export default function Input({ form, width, inputRef, ...rest }: InputProps) {
  return (
    <input
      ref={(input) => {
        if (form) form.register(input);
        if (typeof inputRef === 'function') inputRef(input);
        else if (inputRef) inputRef.current = input;
      }}
      className={`${width || 'w-full'} px-3 bg-dark-4 rounded h-7`}
      {...rest}
    />
  );
}
