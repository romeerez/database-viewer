import { createContext, useContext } from 'react';
import { OpenService } from './OpenState/open.service';

export type DataTreeServerContextValues = {
  openService: OpenService;
};

export const DataTreeServerContext = createContext(
  {} as DataTreeServerContextValues,
);

export const useDataTreeServerContext = () => useContext(DataTreeServerContext);
