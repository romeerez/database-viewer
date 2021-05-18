import { useRef, useState } from 'react';

type Tab = 'data' | 'queries';
const tabLocalStorageKey = 'sidebarTab';

export const useTab = () => {
  const [tab, setTab] = useState<Tab>(() => {
    const value = window.localStorage.getItem(tabLocalStorageKey);
    return value === 'data' || value === 'queries' ? value : 'data';
  });

  const changeTab = (tab: Tab) => {
    window.localStorage.setItem(tabLocalStorageKey, tab);
    setTab(tab);
  };

  return [tab, changeTab] as const;
};

const minWidth = 250;
const defaultWidth = 300;
const widthKey = 'sidebar.width';

export const useResize = () => {
  const width = window.localStorage.getItem(widthKey) || `${defaultWidth}px`;
  const ref = useRef<HTMLDivElement>(null);
  const [listenerRef] = useState<{ current?: (e: MouseEvent) => void }>({
    current: undefined,
  });

  const startResize = (e: React.MouseEvent) => {
    const { current: sidebar } = ref;
    if (!sidebar) return;

    if (listenerRef.current)
      document.removeEventListener('mousemove', listenerRef.current);

    const initialWidth = sidebar.offsetWidth;
    const initialX = e.clientX;

    listenerRef.current = (e) => {
      sidebar.style.width = `${Math.max(
        minWidth,
        initialWidth + e.clientX - initialX,
      )}px`;
    };

    document.addEventListener('mousemove', listenerRef.current);
  };

  const stopResize = () => {
    if (!ref.current || !listenerRef.current) return;

    document.removeEventListener('mousemove', listenerRef.current);

    window.localStorage.setItem(widthKey, ref.current.style.width);
  };

  return { ref, width, startResize, stopResize };
};
