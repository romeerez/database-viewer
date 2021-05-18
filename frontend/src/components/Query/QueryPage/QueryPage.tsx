import React, { useState } from 'react';
import Editor, { useEditorRef } from 'components/Editor/Editor';
import Header from './Header';
import SelectDatabase from './SelectDatabase';
import { toast } from 'react-toastify';
import { useQueryFieldsAndRowsLazyQuery } from 'generated/graphql';
import QueryResult from 'components/Query/QueryResult';
import cn from 'classnames';

export default function QueryPage() {
  const [databaseUrl, setDatabaseUrl] = useState('');
  const editorRef = useEditorRef();

  const [performQuery, { data }] = useQueryFieldsAndRowsLazyQuery({
    onCompleted() {
      editorRef.current?.resize();
    },
  });

  const executeQuery = (query: string) => {
    if (!databaseUrl) {
      return toast('Database not specified', { type: 'error' });
    }
    performQuery({
      variables: {
        url: databaseUrl,
        query,
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="py-3 px-6 grid gap-4 flex-shrink-0 border-b border-dark-3">
        <SelectDatabase
          databaseUrl={databaseUrl}
          setDatabaseUrl={setDatabaseUrl}
        />
      </div>
      <div className={cn('overflow-hidden', data ? 'h-1/3' : 'flex-grow')}>
        <Editor executeQuery={executeQuery} editorRef={editorRef} />
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
}
