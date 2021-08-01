import React from 'react';
import cn from 'classnames';
import Spinner from '../../../components/Common/Spinner/Spinner';
import style from './style.module.css';

export default function Button({
  type = 'button',
  loading = false,
  disabled = loading,
  buttonRef,
  addClass,
  children,
  ...rest
}: {
  buttonRef?: React.Ref<HTMLButtonElement>;
  loading?: boolean;
  addClass?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      ref={buttonRef}
      className={cn('btn btn-primary', addClass)}
      type={type}
      {...rest}
    >
      <Spinner show={loading} addClass="w-8 absolute" />
      <div
        className={cn(
          'duration-300 transition-all',
          loading ? style.hideText : style.showText,
        )}
      >
        {children}
      </div>
    </button>
  );
}
