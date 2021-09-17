import React from 'react';
import cn from 'classnames';
import style from '../DataTree/TreeItems/style.module.css';
import { Key, TextColumnTwoLeft } from '../../icons';

export default function ColumnIcon({
  className,
  isIndexed,
  isPrimary,
  hasForeignKey,
}: {
  className?: string;
  isIndexed?: boolean;
  isPrimary?: boolean;
  hasForeignKey?: boolean;
}) {
  return (
    <div className={cn('relative', className)}>
      {isIndexed && (
        <div
          className={`absolute left-0.5 top-2 w-1 h-2.5 bg-accent rounded ${style.indexedColumnIcon}`}
        />
      )}
      <TextColumnTwoLeft size={18} className="text-light-5" />
      {hasForeignKey && (
        <Key
          size={17}
          className={`absolute ${
            isPrimary ? '-right-1.5' : '-right-1'
          } bottom-0 text-accent`}
        />
      )}
      {isPrimary && (
        <Key
          size={17}
          className={`absolute ${
            hasForeignKey ? '-right-0.5' : '-right-1'
          } bottom-0 text-yellow-1`}
        />
      )}
    </div>
  );
}
