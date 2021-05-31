import React from 'react';
import { classes } from 'components/Common/VirtualTable';
import cn from 'classnames';
import { FieldInfo } from 'components/Table/fieldsInfo.service';

export default function Cell({
  value,
  index,
  isNew,
  fieldsInfo,
}: {
  value: string | null;
  index: number;
  isNew: boolean;
  fieldsInfo: FieldInfo[];
}) {
  const field = fieldsInfo[index];

  return (
    <td className={classes.cell}>
      <textarea
        className={cn('leading-tight resize-none py-2.5', {
          'bg-transparent': !isNew,
          'bg-green-1': isNew,
        })}
        value={value || undefined}
      />
    </td>
  );
}
