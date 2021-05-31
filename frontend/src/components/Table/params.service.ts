import { useRouteMatch } from 'react-router-dom';
import { dataSourcesStore } from 'components/DataSource/dataSource.store';
import { useObserver } from 'mobx-react-lite';

export type ParamsState = ReturnType<typeof useParamsState>;

export const useParamsState = () => {
  const { params } =
    useRouteMatch<{
      sourceName: string;
      databaseName: string;
      schemaName: string;
      tableName: string;
    }>();

  const { sourceName } = params;
  const localDataSources = useObserver(() => dataSourcesStore.dataSources);
  const source = localDataSources?.find((source) => source.name === sourceName);

  return { ...params, sourceUrl: source?.url };
};
