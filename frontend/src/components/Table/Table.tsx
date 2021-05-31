import React, { RefObject, useEffect } from 'react';
import { RowsState } from 'components/Table/rows.state';
import VirtualTable, { classes } from 'components/Common/VirtualTable';
import { DataState } from 'components/Table/data.state';
import { useObserver } from 'mobx-react-lite';
import { addRow } from 'components/Table/rows.service';
import Row from 'components/Table/Row';
import Scrollbars from 'react-custom-scrollbars';
import { FieldInfo } from 'components/Table/fieldsInfo.service';

export default function Table({
  dataState,
  rowsState,
  scrollRef,
  fieldsInfo,
}: {
  dataState: DataState;
  rowsState: RowsState;
  scrollRef: RefObject<Scrollbars>;
  fieldsInfo: FieldInfo[] | undefined;
}) {
  const rows = useObserver(() => rowsState.rows);

  useEffect(() => {
    if (!dataState.fields) return;

    addRow(rowsState, dataState, scrollRef);
  }, [dataState.fields]);

  if (!fieldsInfo) return null;

  return (
    <VirtualTable
      scrollRef={scrollRef}
      fields={dataState.fields}
      head={(fields, style) => (
        <>
          <th className={classes.firstHeading} style={style} />
          {fields.map((field) => (
            <th key={field.name} className={classes.heading} style={style}>
              {field.name}
            </th>
          ))}
        </>
      )}
      rows={rows}
    >
      {(rows, offset) =>
        rows.map((row, i) => {
          const index = i + offset;

          return (
            <Row
              key={index}
              rowsState={rowsState}
              row={row}
              index={index}
              fieldsInfo={fieldsInfo}
            />
          );
        })
      }
    </VirtualTable>
  );
}
