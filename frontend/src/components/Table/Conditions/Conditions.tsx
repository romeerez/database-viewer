import React from 'react';
import Condition from './Condition';
import { useTablePageContext } from '../../../components/Table/TablePage.context';

export default function Conditions() {
  const { tableDataService } = useTablePageContext();

  return (
    <div className="flex w-full">
      <Condition
        conditionType="where"
        onSubmit={(where) => tableDataService.setWhere(where)}
      />
      <Condition
        conditionType="orderBy"
        onSubmit={(orderBy) => tableDataService.setOrderBy(orderBy)}
      />
    </div>
  );
}
