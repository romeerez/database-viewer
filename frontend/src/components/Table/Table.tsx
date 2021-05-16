import React, { useEffect, useRef, useState } from 'react';
import Scrollbars from 'components/Common/Scrollbars';
import { positionValues } from 'react-custom-scrollbars';
import { useTableData } from 'components/Table/tablePage.service';
import { DataSourceInLocalStoreWithDriver } from 'components/DataSource/types';

const cellClass = 'h-10 border-b border-l border-dark-3 px-4 max-w-sm truncate';
const classes = {
  table: 'border-r border-dark-3 text-sm text-left',
  tbody: 'bg-darker',
  th: `${cellClass} bg-dark-2 sticky z-10`,
  cell: cellClass,
  firstCell: `${cellClass} bg-dark-2 sticky -left-px`,
};

const rowHeight = 40;
const fetchNextScrollThreshold = rowHeight * 10;

export default function Table({
  source,
  databaseName,
  schemaName,
  tableName,
}: {
  source?: DataSourceInLocalStoreWithDriver;
  databaseName: string;
  schemaName: string;
  tableName: string;
}) {
  const { fields, rows, fetchNext } = useTableData({
    source,
    databaseName,
    schemaName,
    tableName,
  });

  const innerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    startIndex: -1,
    endIndex: -1,
    translateY: 0,
  });

  const scrollHeight = rowHeight * (rows.length + 1);

  const onScroll = ({ scrollTop, clientHeight }: positionValues) => {
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = startIndex + Math.ceil(clientHeight / rowHeight) + 1;
    if (startIndex !== state.startIndex || endIndex !== state.endIndex) {
      setState({
        startIndex,
        endIndex,
        translateY: startIndex * rowHeight,
      });
    }

    const scrollBottom = scrollHeight - clientHeight - scrollTop;
    if (scrollBottom <= fetchNextScrollThreshold) {
      fetchNext();
    }
  };

  useEffect(() => {
    if (rows.length) {
      (innerRef.current as HTMLDivElement).style.height = `${scrollHeight}px`;
    }
  }, [rows]);

  if (!rows) return null;

  const top = { top: `${-state.translateY}px` };

  return (
    <Scrollbars onUpdate={onScroll} shadows={false}>
      <div ref={innerRef}>
        <table
          className={classes.table}
          style={{ transform: `translateY(${state.translateY}px)` }}
        >
          <thead>
            <tr>
              <th className={classes.th} style={top} />
              {fields.map((field) => (
                <th key={field.name} className={classes.th} style={top}>
                  {field.name}
                </th>
              ))}
            </tr>
          </thead>
          {state.startIndex !== -1 && (
            <tbody className={classes.tbody}>
              {rows.slice(state.startIndex, state.endIndex).map((row, i) => (
                <tr key={i}>
                  <td className={classes.firstCell}>
                    {i + 1 + state.startIndex}
                  </td>
                  {row.map((cell, i) => (
                    <td key={i} className={classes.cell}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </Scrollbars>
  );
}
