import { Params } from '../TablePage';
import { useMemo } from 'react';
import { Item, keyValueStore } from '../../../lib/keyValue.store';

export type ConditionType = 'where' | 'orderBy';

export type ConditionsService = ReturnType<typeof useConditionsService>;

export const useConditionsService = ({
  params: { databaseName, schemaName, tableName },
  sourceUrl,
}: {
  params: Params;
  sourceUrl?: string;
}) => {
  return useMemo(() => {
    const conditionKey = (type: ConditionType) =>
      `${sourceUrl}/${databaseName}/${schemaName}/table/${tableName}.${type}`;
    const getHistoryKey = (type: ConditionType) =>
      `${conditionKey(type)}.history`;
    const getValueKey = (type: ConditionType) => `${conditionKey(type)}.value`;
    const loading = !sourceUrl && { loading: true };

    return {
      getValue(type: ConditionType): Item<string> {
        return loading || keyValueStore.getItem<string>(getValueKey(type));
      },
      useHistory(type: ConditionType): Item<string[]> {
        const item = keyValueStore.useItem<string[]>(getHistoryKey(type));
        return loading || item;
      },
      useValue(
        type: ConditionType,
        options?: { onLoad(value?: string): void },
      ): Item<string> {
        const item = keyValueStore.useItem<string>(getValueKey(type), options);
        return loading || item;
      },
      updateHistory(
        type: ConditionType,
        updater: (value?: string[]) => string[],
      ) {
        !loading &&
          keyValueStore.updateValue<string[]>(getHistoryKey(type), updater);
      },
      updateValue(type: ConditionType, updater: (value?: string) => string) {
        !loading &&
          keyValueStore.updateValue<string>(getValueKey(type), updater);
      },
    };
  }, [databaseName, schemaName, tableName, sourceUrl]);
};
