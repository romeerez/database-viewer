import React from 'react';
import { ChevronRight } from 'icons';

export default function Header({
  breadcrumbs,
  controls,
}: {
  breadcrumbs?: React.ReactNode[];
  controls?: React.ReactNode;
}) {
  const last = breadcrumbs ? breadcrumbs.length - 1 : 0;

  return (
    <div className="flex-shrink-0 py-4 px-6 border-b border-dark-4 flex items-center justify-between">
      <div className="flex items-center text-light-4">
        {breadcrumbs?.map((breadcrumb, i) => (
          <React.Fragment key={i}>
            {breadcrumb}
            {i !== last && (
              <ChevronRight className="relative top-0.5" size={18} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center">{controls}</div>
    </div>
  );
}
