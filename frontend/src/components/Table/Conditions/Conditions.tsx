import React from 'react';
import { DataStore } from '../data.store';
import Condition from './Condition';
import { DataService } from 'components/Table/data.service';

export default function Conditions({
  store,
  service,
}: {
  store: DataStore;
  service: DataService;
}) {
  return (
    <div className="flex w-full">
      <Condition
        store={store}
        conditionType="where"
        onSubmit={(where) => service.setWhere(where)}
      />
      <Condition
        store={store}
        conditionType="orderBy"
        onSubmit={(orderBy) => service.setOrderBy(orderBy)}
      />
    </div>
  );
}
