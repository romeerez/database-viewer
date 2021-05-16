import React from 'react';
import { useObserver } from 'mobx-react-lite';
import { themeSwitcher } from 'components/Theme/themeSwitcher';

export default function Theme({ children }: { children: React.ReactNode }) {
  const dark = useObserver(() => themeSwitcher.dark);
  document.documentElement.classList.toggle('light-mode', !dark);

  return <>{children}</>;
}
