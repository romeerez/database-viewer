import { useRef, useState } from 'react';
import { dispatchWindowResizeEvent } from 'lib/onWindowResize';

const useResize = ({
  type,
  localStorageKey,
  defaultSize,
  minSize,
}: {
  type: 'width' | 'height';
  localStorageKey: string;
  defaultSize: number | string;
  minSize: number;
}) => {
  const size =
    window.localStorage.getItem(localStorageKey) || `${defaultSize}px`;
  const ref = useRef<HTMLDivElement>(null);
  const [listenerRef] = useState<{ current?: (e: MouseEvent) => void }>({
    current: undefined,
  });

  const startResize = (e: React.MouseEvent) => {
    const { current: el } = ref;
    if (!el) return;

    if (listenerRef.current)
      document.removeEventListener('mousemove', listenerRef.current);

    const initialSize = el[type === 'width' ? 'offsetWidth' : 'offsetHeight'];
    const prop = type === 'width' ? 'clientX' : 'clientY';
    const initialPos = e[prop];

    listenerRef.current = (e) => {
      const diff =
        type === 'width' ? e[prop] - initialPos : initialPos - e[prop];
      el.style[type] = `${Math.max(minSize, initialSize + diff)}px`;

      if (type === 'width') {
        dispatchWindowResizeEvent();
      }
    };

    document.addEventListener('mousemove', listenerRef.current);
  };

  const stopResize = () => {
    if (!ref.current || !listenerRef.current) return;

    document.removeEventListener('mousemove', listenerRef.current);

    window.localStorage.setItem(localStorageKey, ref.current.style[type]);
  };

  return { ref, size, startResize, stopResize };
};

export const useResizeSidebar = () =>
  useResize({
    type: 'width',
    localStorageKey: 'sidebar.width',
    defaultSize: 300,
    minSize: 250,
  });

export const useResizeQueries = () =>
  useResize({
    type: 'height',
    localStorageKey: 'sidebar.queries.height',
    defaultSize: 250,
    minSize: 200,
  });

export type PanelState = 'min' | 'normal' | 'max';
const defaultPanelState = 'normal';
const panelStateKey = 'sidebar.queries.panelState';

export const useQueriesPanelState = () => {
  const [state, setState] = useState<PanelState>(
    () =>
      (window.localStorage.getItem(panelStateKey) as PanelState) ||
      defaultPanelState,
  );

  const changeState = (state: PanelState) => {
    window.localStorage.setItem(panelStateKey, state);
    setState(state);
  };

  return {
    state,
    minimize() {
      changeState('min');
    },
    normalize() {
      changeState('normal');
    },
    maximize() {
      changeState('max');
    },
  };
};
