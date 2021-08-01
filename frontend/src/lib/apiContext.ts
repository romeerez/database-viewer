import { createContext, useContext } from 'react';
import { APIContext as APIContextType } from 'types';

export const APIContext = createContext({} as APIContextType);

export const useAPIContext = () => useContext(APIContext);
