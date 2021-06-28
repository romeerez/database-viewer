import React from 'react';
import style from './style.module.css';
import cn from 'classnames';

type ControlledProps = {};

export default function Toggle({
  className,
  toggleColor,
  inputProps,
  checked,
  onChange,
}: {
  className?: string;
  toggleColor?: boolean;
  checked?: boolean;
  onChange?(checked: boolean): void;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}) {
  return (
    <div className={cn('relative', className)}>
      <input
        type="checkbox"
        className={`sr-only ${style.input}`}
        checked={checked}
        onChange={onChange && ((e) => onChange(e.target.checked))}
        {...inputProps}
      />
      <div
        className={`w-8 h-4 bg-darker-5 rounded-full ${style.dotContainer}`}
      />
      <div
        className={cn(
          'absolute w-4 h-4 rounded-full shadow left-0 top-0 transition',
          style.dot,
          toggleColor ? 'bg-dark-6' : 'bg-accent',
        )}
      />
    </div>
  );
}
