import { makeAutoObservable } from 'mobx';
import { QueryResult } from 'generated/graphql';
import { useLocalObservable } from 'mobx-react-lite';

const defaultLimit = 10;

export type DataState = ReturnType<typeof useDataState>;

export const useDataState = () =>
  useLocalObservable(() => {
    const state = {
      fields: undefined as QueryResult['fields'] | undefined,
      rows: undefined as QueryResult['rows'] | undefined,
      count: undefined as number | undefined,
      loading: false,
      where: '',
      orderBy: '',
      limit: defaultLimit,
      offset: 0,
    };

    return makeAutoObservable({
      ...state,
      update(data: Partial<typeof state>, callback?: () => void) {
        Object.assign(this, data);
        callback?.();
      },
    });
  });
