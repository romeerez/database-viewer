import { createContext, useContext } from 'react';
import { SearchService } from './Search/search.service';
import { ModalsService } from './Modals/modals.service';

export type DataTreeContextValues = {
  searchService: SearchService;
  modalsService: ModalsService;
};

export const DataTreeContext = createContext({} as DataTreeContextValues);

export const useDataTreeContext = () => useContext(DataTreeContext);
