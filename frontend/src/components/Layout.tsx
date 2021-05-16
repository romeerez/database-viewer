import React from 'react';
import Sidebar from 'components/Sidebar/Sidebar';
import Router from 'components/Router';

export default function Layout() {
  return (
    <div className="flex h-full">
      <Sidebar className="flex-shrink-0" />
      <div className="flex-grow w-0">
        <Router />
      </div>
    </div>
  );
}
