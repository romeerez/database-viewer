import React from 'react';
import { X } from '../../icons';
import cn from 'classnames';

export default function ErrorAlert({
  error,
  onClose,
  className,
}: {
  error?: string;
  onClose(): void;
  className?: string;
}) {
  return !error ? null : (
    <div className={cn('bg-error-dark px-5 py-3 relative', className)}>
      <button
        type="button"
        className="flex absolute top-3 right-3"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      {error}
    </div>
  );
}
