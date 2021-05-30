import React from 'react';
import { Form } from 'lib/useForm';

export type TextAreaProps = {
  form: Form;
  width?: string;
};

export default function TextArea({ form, width, ...rest }: TextAreaProps) {
  const change = (e: { target: HTMLTextAreaElement }) => {
    const el = e.target;
    el.style.height = '';
    el.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <textarea
      ref={(el) => {
        form.register(el);
        if (el) {
          change({ target: el });
        }
      }}
      onChange={change}
      className={`${
        width || 'w-full'
      } px-3 bg-dark-5 rounded h-7 pt-0.5 resize-none`}
      {...rest}
    />
  );
}
