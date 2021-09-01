import React, { ReactNode } from 'react';
import cn from 'classnames';

export default function MenuItem({
  children,
  buttonRef,
  className,
  component: Component = 'button',
  ...rest
}: {
  buttonRef?: React.LegacyRef<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  component?: string | (() => ReactNode);
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <Component
      ref={buttonRef}
      className={cn(
        'h-8 flex min-w-full items-center px-3 whitespace-nowrap text-light-3 hover:text-light-1 hover:bg-lighter',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
