import React, { useEffect } from 'react';
import { useDataStore } from 'components/Table/data.store';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import ControlPanel from './ControlPanel';
import Conditions from './Conditions/Conditions';
import Table from 'components/Table/Table/Table';
import { useDataService } from 'components/Table/data.service';

export default function TablePage() {
  const { pathname } = useLocation();

  return <TablePageReMountable key={pathname} />;
}

const TablePageReMountable = () => {
  const store = useDataStore();
  const service = useDataService({ store });

  useEffect(() => {
    service.addRow();
  }, [store.fields]);

  return (
    <div className="flex flex-col h-full">
      <Header store={store} />
      <ControlPanel store={store} service={service} />
      <Conditions store={store} service={service} />
      <Table store={store} service={service} />
    </div>
  );
};
