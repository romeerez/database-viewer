import React from 'react';
import cn from 'classnames';
import Spinner from 'components/Common/Spinner/Spinner';
import style from './style.module.css';

export default function Button({
  type = 'button',
  loading = false,
  disabled = loading,
  children,
  ...rest
}: { loading: boolean } & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button className="btn-primary" type={type} {...rest}>
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
