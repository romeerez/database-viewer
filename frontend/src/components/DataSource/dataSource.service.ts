import { useAPIContext } from 'graphql-react-provider';
import { dataSourcesStore } from 'components/DataSource/dataSource.store';
import { useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { DataSourceInLocalStore } from 'components/DataSource/types';
import { toast } from 'react-toastify';

type Error = {
  field: 'name' | 'url';
  message: string;
};

export const useSaveDataSource = ({
  dataSource,
  onClose,
}: {
  dataSource?: DataSourceInLocalStore;
  onClose(): void;
}) => {
  const { useCheckConnectionMutation } = useAPIContext();
  const [checkConnection] = useCheckConnectionMutation();

  const [loading, setLoading] = useState(false);

  const dataSourcesLocal = useObserver(() => dataSourcesStore.dataSources);

  const save = async ({
    name,
    url,
  }: {
    name: string;
    url: string;
  }): Promise<Error[] | undefined> => {
    if (!dataSourcesLocal) return;

    const errors: Error[] = [];
    const nameTaken = dataSourcesLocal.some(
      (source) =>
        (!dataSource || dataSource.id !== source.id) && source.name === name,
    );
    if (nameTaken) {
      errors.push({
        field: 'name',
        message: 'Datasource with this name already exists',
      });
    }

    const existing = dataSourcesLocal.find(
      (source) =>
        (!dataSource || dataSource.id !== source.id) && source.url === url,
    );
    if (existing) {
      errors.push({
        field: 'url',
        message: `There is already ${existing.name} data source with same url`,
      });
    }

    if (errors.length) return errors;

    setLoading(true);

    const { data } = await checkConnection({ variables: { url } });
    if (data?.checkConnection) {
      if (!dataSource) {
        const now = new Date();
        await dataSourcesStore.create({
          name,
          url,
          updatedAt: now,
          createdAt: now,
        });
        toast.info('Data source was added');
      } else {
        await dataSourcesStore.update(dataSource.id, {
          name,
          url,
          updatedAt: new Date(),
        });
        toast.info('Data source was updated');
      }
      onClose();
    } else {
      toast('Cannot connect', { type: 'error' });
      setLoading(false);
    }
  };

  return { save, loading };
};

export const useRemoveDataSource = () => {
  const [loading, setLoading] = useState(false);

  const remove = async (dataSource: DataSourceInLocalStore) => {
    setLoading(true);
    try {
      await dataSourcesStore.delete(dataSource.id);
      toast('Data source was deleted', { type: 'info' });
      return true;
    } catch (error) {
      toast(error.message, { type: 'info' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};
