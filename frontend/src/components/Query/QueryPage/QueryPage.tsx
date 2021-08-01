import React, { useState } from 'react';
import Editor, { useEditorRef } from 'components/Editor/Editor';
import Header from './Header';
import SelectDatabase from './SelectDatabase';
import { toast } from 'react-toastify';
import { QueryFieldsAndRowsQuery, useAPIContext } from 'graphql-react-provider';
import QueryResult from 'components/Query/QueryResult';
import cn from 'classnames';
import { updateQuery, useQueries } from 'components/Query/query.service';
import { useParams } from 'react-router-dom';
import { QueryInLocalStore } from 'components/Query/types';
import { IDisposable } from 'monaco-editor';
import { useObserver } from 'mobx-react-lite';
import { getSourceUrlAndDatabaseNameFromUrl } from 'lib/sourceUrl';

export default function QueryPage() {
  const { name } = useParams<{ name: string }>();
  const queries = useQueries();
  const editorRef = useEditorRef();
  const [data, setData] = useState<QueryFieldsAndRowsQuery | undefined>();

  const query = queries?.find((query) => query.name === name);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!query || !editor) return;

    editor.setValue(query.content);
    if (data) setData(undefined);

    const disposable: IDisposable | undefined = editor.onDidChangeModelContent(
      () => {
        updateQuery(query, {
          content: editor.getValue(),
        });
      },
    );

    return () => disposable.dispose();
  }, [query]);

  if (!query) return null;

  return (
    <QueryPageInner
      query={query}
      editorRef={editorRef}
      data={data}
      setData={setData}
    />
  );
}

const QueryPageInner = React.memo(
  ({
    query,
    editorRef,
    data,
    setData,
  }: {
    query: QueryInLocalStore;
    editorRef: ReturnType<typeof useEditorRef>;
    data: QueryFieldsAndRowsQuery | undefined;
    setData(data: QueryFieldsAndRowsQuery | undefined): void;
  }) => {
    const { useQueryFieldsAndRowsLazyQuery } = useAPIContext();

    const [performQuery] = useQueryFieldsAndRowsLazyQuery({
      fetchPolicy: 'no-cache',
      onCompleted(data) {
        editorRef.current?.resize();
        setData(data);
      },
    });

    const executeQuery = (queryString: string) => {
      if (!query.databaseUrl) {
        return toast('Database not specified', { type: 'error' });
      }
      performQuery({
        variables: {
          url: query.databaseUrl,
          query: queryString,
        },
      });
    };

    const databaseUrl = useObserver(() => query.databaseUrl) || '';
    const setDatabaseUrl = (databaseUrl: string) =>
      updateQuery(query, { databaseUrl });

    const { sourceUrl, databaseName } =
      getSourceUrlAndDatabaseNameFromUrl(databaseUrl);

    return (
      <div className="flex flex-col h-full">
        <Header query={query} />
        <div className="py-3 px-6 grid gap-4 flex-shrink-0 border-b border-dark-4">
          <SelectDatabase
            databaseUrl={databaseUrl}
            setDatabaseUrl={setDatabaseUrl}
          />
        </div>
        <div className={cn('overflow-hidden', data ? 'h-1/3' : 'flex-grow')}>
          <Editor
            executeQuery={executeQuery}
            editorRef={editorRef}
            sourceUrl={sourceUrl}
            databaseName={databaseName}
          />
        </div>
        {data && (
          <div className="flex-grow">
            <QueryResult
              fields={data.executeQuery.fields}
              rows={data.executeQuery.rows}
            />
          </div>
        )}
      </div>
    );
  },
);
