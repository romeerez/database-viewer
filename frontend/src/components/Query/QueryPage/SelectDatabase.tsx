import React, { useEffect, useMemo, useRef } from 'react';
import Select from 'components/Common/Form/Select';
import Input from 'components/Common/Form/Input';
import { useDataTree } from 'components/DataTree/dataTree.service';
import { ChevronRight } from 'icons';
import DataSourceFormButton from 'components/DataSource/Form/DataSourceFormButton';
import Spinner from 'components/Common/Spinner/Spinner';

export default function SelectDatabase({
  databaseUrl,
  setDatabaseUrl,
}: {
  databaseUrl: string;
  setDatabaseUrl(value: string): void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const { dataSourcesLocal, tree } = useDataTree();
  const databaseOptions = useMemo(
    () =>
      dataSourcesLocal &&
      tree?.dataSources.flatMap((source) => {
        let url = source.url;
        const match = url.match(/\w+:\/\/[^/]+/);
        if (match) url = match[0];

        const sourceName =
          dataSourcesLocal.find((local) => local.url === source.url)?.name ||
          url;

        return source.databases.map((database) => ({
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
    [dataSourcesLocal, tree],
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
        <DataSourceFormButton>
          {(toggle) => (
            <button className="text-accent hover:underline" onClick={toggle}>
              connect to datasource
            </button>
          )}
        </DataSourceFormButton>{' '}
        first.
      </div>
    );
  }

  return (
    <form className="flex justify-start" onSubmit={(e) => e.preventDefault()}>
      <label className="flex items-center">
        <div className="mr-2">Database:</div>
        <Select
          value={databaseUrl}
          setValue={setDatabaseUrl}
          formRef={formRef}
          options={databaseOptions}
          filter
          input={(props) => (
            <Input
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
          )}
        />
      </label>
    </form>
  );
}