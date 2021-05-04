import React from 'react';
import cx from 'clsx';
import { Postgresql, Database, FlowChart, Table } from 'icons';

const MenuItem = function MenuItem({
  icon: Icon,
  title,
  children,
}: {
  icon: (props: {
    size: number;
    className: string;
  }) => React.ReactElement | null;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <button className="h-8 w-full flex items-center mb-1 px-2 rounded hover:bg-primary-30">
        {<Icon size={16} className="mr-2 text-accent" />}
        {title}
      </button>
      <div className="pl-4">{children}</div>
    </div>
  );
};

export default function Sidebar(className: { className?: string }) {
  return (
    <div className={cx('w-72 p-4 border-r border-primary-30', className)}>
      <MenuItem icon={Postgresql} title={'orms_overview@localhost'}>
        <MenuItem icon={Database} title="orms_overview">
          <MenuItem icon={FlowChart} title="public">
            {new Array(20).fill(null).map((_, i) => (
              <MenuItem key={i} icon={Table} title={`table ${i + 1}`} />
            ))}
          </MenuItem>
        </MenuItem>
      </MenuItem>
    </div>
  );
}
