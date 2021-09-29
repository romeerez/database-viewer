import { serversStore } from './server.store';
import { useState } from 'react';
import { ServerInLocalStore } from './types';
import { toast } from 'react-toastify';
import { useAPIContext } from '../../lib/apiContext';

type Error = {
  field: 'name' | 'url';
  message: string;
};

export const useSaveServer = ({
  server,
  onClose,
}: {
  server?: ServerInLocalStore;
  onClose(): void;
}) => {
  const { useCheckConnectionMutation } = useAPIContext();
  const [checkConnection] = useCheckConnectionMutation();

  const [loading, setLoading] = useState(false);

  const { data: serversLocal } = serversStore.useServers();

  const save = async ({
    name,
    url,
  }: {
    name: string;
    url: string;
  }): Promise<Error[] | undefined> => {
    if (!serversLocal) return;

    const errors: Error[] = [];
    const nameTaken = serversLocal.some(
      (server) => (!server || server.id !== server.id) && server.name === name,
    );
    if (nameTaken) {
      errors.push({
        field: 'name',
        message: 'Server with this name already exists',
      });
    }

    const existing = serversLocal.find(
      (server) => (!server || server.id !== server.id) && server.url === url,
    );
    if (existing) {
      errors.push({
        field: 'url',
        message: `There is already ${existing.name} data server with same url`,
      });
    }

    if (errors.length) return errors;

    setLoading(true);

    const { data } = await checkConnection({ variables: { url } });
    if (data?.checkConnection) {
      if (!server) {
        const now = new Date();
        await serversStore.create({
          name,
          url,
          updatedAt: now,
          createdAt: now,
        });
        toast.info('Data server was added');
      } else {
        await serversStore.update(server.id, {
          name,
          url,
          updatedAt: new Date(),
        });
        toast.info('Data server was updated');
      }
      onClose();
    } else {
      toast('Cannot connect', { type: 'error' });
      setLoading(false);
    }
  };

  return { save, loading };
};

export const useRemoveServer = () => {
  const [loading, setLoading] = useState(false);

  const remove = async (server: ServerInLocalStore) => {
    setLoading(true);
    try {
      await serversStore.delete(server.id);
      toast('Data server was deleted', { type: 'info' });
      return true;
    } catch (error) {
      toast((error as Error).message, { type: 'info' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};
