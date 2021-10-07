import React, { useMemo } from 'react';
import Select from '../../../components/Common/Form/Select';
import Input from '../../../components/Common/Form/Input';
import { ChevronRight } from '../../../icons';
import ServerFormButton from '../../../components/Server/Form/ServerFormButton';
import Spinner from '../../../components/Common/Spinner/Spinner';
import { getSourceUrlAndDatabaseNameFromUrl } from '../../../lib/sourceUrl';
import { useLoadAllServerTrees } from '../../../api/server';
import { useLocalServers } from '../../Server/server.service';

// TODO: fix clicking behavior
export default function SelectDatabase({
  databaseUrl,
  setDatabaseUrl,
}: {
  databaseUrl: string;
  setDatabaseUrl(value: string): void;
}) {
  const { data: localServers = [] } = useLocalServers();
  const servers = useLoadAllServerTrees();

  const databaseOptions = useMemo(
    () =>
      servers.flatMap((server) => {
        const { sourceUrl: url } = getSourceUrlAndDatabaseNameFromUrl(
          server.url,
        );

        const sourceName =
          localServers.find((local) => local.url === server.url)?.name || url;

        return server.databases.map((database) => ({
          label: (
            <>
              {sourceName}
              <ChevronRight size={16} />
              {database.name}
            </>
          ),
          text: `${sourceName} > ${database.name}`,
          value: `${url}/${database.name}`,
        }));
      }),
    [servers],
  );

  if (!databaseOptions) {
    return (
      <div className="h-7 flex items-center">
        <Spinner />
      </div>
    );
  }

  if (databaseOptions.length === 0) {
    return (
      <div className="h-7">
        No databases to perform query, please{' '}
        <ServerFormButton>
          {(toggle) => (
            <button className="text-accent hover:underline" onClick={toggle}>
              connect to datasource
            </button>
          )}
        </ServerFormButton>{' '}
        first.
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <label className="flex items-center">
        <div className="mr-2">Database:</div>
        <Select
          value={databaseUrl}
          setValue={setDatabaseUrl}
          options={databaseOptions}
          filter
          input={({ ref, ...props }) => {
            return (
              <Input
                inputRef={ref}
                autoComplete="off"
                name="database"
                width="w-64"
                value={
                  (databaseUrl &&
                    databaseOptions?.find(
                      (option) => option.value === databaseUrl,
                    )?.text) ||
                  databaseUrl
                }
                onChange={(e) => setDatabaseUrl(e.target.value)}
                {...props}
              />
            );
          }}
        />
      </label>
    </div>
  );
}
