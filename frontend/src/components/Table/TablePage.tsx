import React, { useEffect, useRef, useState } from 'react';
import Editor, { useEditorRef } from 'components/Editor/Editor';
import Table from './Table';
import { useRouteMatch } from 'react-router-dom';
import { dataSourcesStore } from 'components/DataSource/dataSource.store';
import { useObserver } from 'mobx-react-lite';
import { buildQuery } from 'lib/queryBuilder';
import { IDisposable } from 'monaco-editor';
import { useQueryFieldsAndRowsLazyQuery } from 'generated/graphql';
import Header from 'components/Common/Header';

const perPage = 100;

export default function TablePage() {
  const editorRef = useEditorRef();

  const { params } =
    useRouteMatch<{
      sourceName: string;
      databaseName: string;
      schemaName: string;
      tableName: string;
    }>();

  const { sourceName, databaseName, schemaName, tableName } = params;

  const initialQuery = buildQuery({ schemaName, tableName, limit: perPage });

  const [queryFromEditor, setQueryFromEditor] = useState(false);

  useEffect(() => {
    setQueryFromEditor(false);
    editorRef.current?.setValue(initialQuery);
  }, [params]);

  const ignoreOnChange = useRef(false);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    let disposable: IDisposable | undefined = editor.onDidChangeModelContent(
      () => {
        if (ignoreOnChange.current) return;
        setQueryFromEditor(true);
        disposable?.dispose();
        disposable = undefined;
      },
    );

    return () => disposable?.dispose();
  }, []);

  const setQuery = (query: string) => {
    ignoreOnChange.current = true;
    editorRef.current?.setValue(query);
    ignoreOnChange.current = false;
  };

  const localDataSources = useObserver(() => dataSourcesStore.dataSources);

  const source = localDataSources?.find((source) => source.name === sourceName);

  const [performQuery, { data, error }] = useQueryFieldsAndRowsLazyQuery();

  const executeQuery = (query: string) => {
    if (!source) return;

    performQuery({
      variables: {
        url: `${source.url}/${databaseName}`,
        query,
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Header breadcrumbs={[sourceName, databaseName, schemaName, tableName]} />
      <div className="h-1/4 flex-shrink-0">
        <Editor
          initialValue={initialQuery}
          source={source}
          databaseName={databaseName}
          schemaName={schemaName}
          executeQuery={executeQuery}
          editorRef={editorRef}
        />
      </div>
      <Table
        queryFromEditor={queryFromEditor}
        data={data}
        useProvidedData={Boolean(data || error)}
        source={source}
        databaseName={databaseName}
        schemaName={schemaName}
        tableName={tableName}
        perPage={perPage}
        initialQuery={initialQuery}
        setQuery={setQuery}
      />
    </div>
  );
}
