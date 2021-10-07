import { createContext, useContext } from 'react';
import { ApiContext as ApiContextType } from 'types';

export const APIContext = createContext({} as ApiContextType);

export const useAPIContext = () => useContext(APIContext);
