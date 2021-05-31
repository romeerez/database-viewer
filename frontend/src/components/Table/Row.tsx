import React from 'react';
import { classes } from 'components/Common/VirtualTable';
import { Row as RowType, RowsState } from './rows.state';
import { isNewRow } from 'components/Table/rows.service';
import cn from 'classnames';
import Cell from 'components/Table/Cell';
import { FieldInfo } from 'components/Table/fieldsInfo.service';

const rowStyle = { lineHeight: 0 };

export default function Row({
  rowsState,
  row,
  index,
  fieldsInfo,
}: {
  rowsState: RowsState;
  row: RowType;
  index: number;
  fieldsInfo: FieldInfo[];
}) {
  const isNew = isNewRow(rowsState, index);

  return (
    <tr style={rowStyle}>
      <td
        className={cn(classes.firstCell, {
          'bg-green-2': isNew,
        })}
      >
        {index + 1}
      </td>
      {row.map((value, i) => (
        <Cell
          key={i}
          value={value}
          index={i}
          isNew={isNew}
          fieldsInfo={fieldsInfo}
        />
      ))}
    </tr>
  );
}
