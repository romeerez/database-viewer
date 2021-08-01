import React, { ReactNode } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <Sidebar className="flex-shrink-0" />
      <div className="flex-grow w-0">{children}</div>
    </div>
  );
}
