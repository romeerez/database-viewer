import React from 'react';
import Scrollbars from '../../components/Common/Scrollbars';
import Search from './Search/Search';
import ServerFormButton from '../../components/Server/Form/ServerFormButton';
import { Plus } from '../../icons';
import DataTreeModals from '../../components/DataTree/Modals/DataTreeModals';
import { DataTreeContext } from './dataTree.context';
import { useCreateSearchService } from './Search/search.service';
import { useCreateModalsService } from './Modals/modals.service';
import { useLocalServers } from '../Server/server.service';
import { PathState } from './path.state';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Server from './Server';

export default function DataTree() {
  const path = PathState.use('path');
  const { data: localServers } = useLocalServers();

  const searchService = useCreateSearchService();
  const modalsService = useCreateModalsService();

  return (
    <DataTreeContext.Provider
      value={{
        searchService,
        modalsService,
      }}
    >
      <DataTreeModals />
      <div className="p-4 flex items-center">
        <Search />
        <ServerFormButton>
          {(toggle) => (
            <button className="w-6 h-6 ml-2 flex-center" onClick={toggle}>
              <Plus size={16} />
            </button>
          )}
        </ServerFormButton>
      </div>
      <Scrollbars>
        <div className="p-4 pt-0 inline-block min-w-full">
          {localServers && (
            <div
              className="duration-300 transition"
              style={{
                transform: path.length ? 'translateY(0)' : 'translateY(-48px)',
              }}
            >
              <Breadcrumbs />
              {localServers.map((server, i) => (
                <Server key={i} localServer={server} />
              ))}
            </div>
          )}
        </div>
      </Scrollbars>
    </DataTreeContext.Provider>
  );
}
