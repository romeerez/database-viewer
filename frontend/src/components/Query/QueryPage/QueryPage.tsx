import React, { useEffect, useRef, useState } from 'react';
import Editor, { useEditorRef } from '../../../components/Editor/Editor';
import Header from './Header';
import SelectDatabase from './SelectDatabase';
import { toast } from 'react-toastify';
import QueryResult from '../../../components/Query/QueryResult';
import cn from 'classnames';
import { updateQuery, useQueries } from '../query.service';
import { useParams } from 'react-router-dom';
import { QueryInLocalStore } from '../types';
import { IDisposable } from 'monaco-editor';
import { getSourceUrlAndDatabaseNameFromUrl } from '../../../lib/sourceUrl';
import { QueryFieldsAndRowsQuery } from 'types';
import ErrorAlert from '../../Common/ErrorAlert';
import { useFieldsAndRowsLazyQuery } from '../../../api/query';

export default function QueryPage() {
  const { name } = useParams<{ name: string }>();
  const { data: queries } = useQueries();
  const editorRef = useEditorRef();
  const [data, setData] = useState<QueryFieldsAndRowsQuery | undefined>();

  const query = queries?.find((query) => query.name === name);
  const initialized = useRef(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!query || !editor) return;

    if (!initialized.current) {
      initialized.current = true;
      editor.setValue(query.content);
    }
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
    const [error, setError] = useState<string>();

    const [performQuery] = useFieldsAndRowsLazyQuery({
      onSuccess(data) {
        editorRef.current?.resize();
        setData(data);
        setError(undefined);
      },
      onError(error) {
        setError(error.message);
      },
    });

    const executeQuery = (queryString: string) => {
      if (!query.databaseUrl) {
        return toast('Database not specified', { type: 'error' });
      }
      performQuery({
        url: query.databaseUrl,
        query: queryString,
      });
    };

    const databaseUrl = query.databaseUrl || '';
    const setDatabaseUrl = (databaseUrl: string) =>
      updateQuery(query, { databaseUrl });

    const { sourceUrl, databaseName } =
      getSourceUrlAndDatabaseNameFromUrl(databaseUrl);

    return (
      <div className="flex flex-col h-full relative">
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
        <ErrorAlert
          error={error}
          className="absolute left-0 right-0 bottom-0"
          onClose={() => setError(undefined)}
        />
      </div>
    );
  },
);
