import { computed, useCreateStore } from 'jastaman';

export const useCreateSearchStore = () => {
  return useCreateStore(() => ({
    state: {
      search: '',
      lowerSearch: computed<string>(),
    },
    computed: {
      lowerSearch: [
        (state) => [state.search],
        (state) => {
          return state.search.toLocaleLowerCase();
        },
      ],
    },
  }));
};
