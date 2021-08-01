import React, {
  CSSProperties,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import Scrollbars from '../../components/Common/Scrollbars';
import { positionValues } from 'react-custom-scrollbars';
import { Field } from 'types';
import Scroll from 'react-custom-scrollbars';

const cellClass = 'h-10 border-b border-l border-dark-4 max-w-sm truncate';
const cellPx3Class = `${cellClass} px-3`;
const cellPx4Class = `${cellClass} px-4`;

export const classes = {
  table: 'border-r border-dark-4 text-sm text-left',
  tbody: 'bg-darker',
  heading: `${cellPx4Class} bg-dark-3 sticky z-10`,
  cell: cellPx4Class,
  firstHeading: `${cellPx3Class} bg-dark-3 sticky z-10`,
  firstCell: `${cellPx3Class} bg-dark-3 sticky -left-px`,
};

const rowHeight = 40;

export default function VirtualTable<Rows extends unknown[]>({
  fields,
  head,
  children,
  rows,
  scrollRef,
}: {
  fields?: Field[];
  head(fields: Field[], style: CSSProperties): React.ReactNode;
  children(rows: Rows, offset: number): React.ReactNode;
  rows?: Rows;
  scrollRef?: RefObject<Scroll>;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    startIndex: -1,
    endIndex: -1,
    translateY: 0,
  });

  const rowsCount = rows?.length || 0;

  useEffect(() => {
    if (rowsCount > 0) {
      (innerRef.current as HTMLDivElement).style.height = `${scrollHeight}px`;
    }
  }, [rowsCount]);

  if (rowsCount === 0 || !fields) return null;

  const scrollHeight = rowHeight * (rowsCount + 1);

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
  };

  const style = { top: `${-state.translateY}px` };
  const offset = state.startIndex;

  return (
    <Scrollbars onUpdate={onScroll} shadows={false} scrollRef={scrollRef}>
      <div ref={innerRef}>
        <table
          className={classes.table}
          style={{ transform: `translateY(${state.translateY}px)` }}
        >
          <thead>
            <tr>{head(fields, style)}</tr>
          </thead>
          {state.startIndex !== -1 && rows && (
            <tbody className={classes.tbody}>
              {children(
                rows.slice(state.startIndex, state.endIndex) as Rows,
                offset,
              )}
            </tbody>
          )}
        </table>
      </div>
    </Scrollbars>
  );
}
