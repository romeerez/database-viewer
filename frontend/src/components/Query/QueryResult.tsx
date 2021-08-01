import React from 'react';
import { Field, QueryResult as QueryResultType } from 'graphql-react-provider';
import VirtualTable, { classes } from '../../components/Common/VirtualTable';

export default function QueryResult({
  fields,
  rows,
}: {
  fields?: Field[];
  rows?: QueryResultType['rows'];
}) {
  return (
    <VirtualTable
      fields={fields}
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
        rows.map((row, i) => (
          <tr key={i}>
            <td className={classes.firstCell}>{i + offset + 1}</td>
            {row.map((cell, i) => (
              <td key={i} className={classes.cell}>
                {cell}
              </td>
            ))}
          </tr>
        ))
      }
    </VirtualTable>
  );
}
