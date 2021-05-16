import React from 'react';
import cn from 'clsx';

export default function MenuItem({
  children,
  buttonRef,
  className,
  ...rest
}: {
  buttonRef?: React.LegacyRef<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      ref={buttonRef}
      className={cn(
        'h-8 flex min-w-full items-center px-3 text-light-3 hover:text-light hover:bg-lighter',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
