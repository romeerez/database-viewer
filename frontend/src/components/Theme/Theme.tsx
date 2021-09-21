import React from 'react';
import { themeSwitcher } from './themeSwitcher';

export default function Theme({ children }: { children: React.ReactNode }) {
  const dark = themeSwitcher.use('dark');
  document.documentElement.classList.toggle('light-mode', !dark);

  return <>{children}</>;
}
