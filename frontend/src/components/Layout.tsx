import React from 'react';
import Sidebar from 'components/Sidebar/Sidebar';
import HomePage from 'components/HomePage';

export default function Layout() {
  return (
    <div className="flex h-full text-secondary">
      <Sidebar className="flex-shrink-0" />
      <HomePage className="flex-grow" />
    </div>
  );
}
