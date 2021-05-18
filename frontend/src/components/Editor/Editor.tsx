import React, { useEffect, useRef, useState } from 'react';
import { editor as MonacoEditor } from 'monaco-editor';
import { DataSourceInLocalStoreWithDriver } from 'components/DataSource/types';
import { useDataTree } from 'components/DataTree/dataTree.service';
import { enableSuggestions } from 'components/Editor/suggestions';
import { useExecuteWidget } from 'components/Editor/executeWidget';
import './style.css';
import { useVim } from 'components/Editor/useVim';

MonacoEditor.setTheme('vs-dark');

export type ExtendedEditor = MonacoEditor.IStandaloneCodeEditor & {
  resize(): void;
  _domElement: HTMLDivElement;
};

export const useEditorRef = () => {
  const [editorRef] = useState<{
    current?: ExtendedEditor;
  }>({});

  return editorRef;
};

export default function Editor({
  editorRef,
  source,
  databaseName,
  schemaName,
  initialValue,
  executeQuery,
}: {
  editorRef: { current?: ExtendedEditor };
  source?: DataSourceInLocalStoreWithDriver;
  databaseName?: string;
  schemaName?: string;
  initialValue?: string;
  executeQuery(query: string): void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const executeQueryRef = useRef(executeQuery);
  executeQueryRef.current = executeQuery;

  const { tree } = useDataTree();
  const sourceUrl = source?.url;
  const dataSource = sourceUrl
    ? tree?.dataSources.find((source) => source.url === sourceUrl)
    : undefined;
  const database = databaseName
    ? dataSource?.databases.find((database) => database.name === databaseName)
    : undefined;
  const schema = schemaName
    ? database?.schemas.find((schema) => schema.name === schemaName)
    : undefined;
  const tables = schema?.tables;

  const { addExecuteAction } = useExecuteWidget({ executeQueryRef });

  useEffect(() => {
    const el = ref.current as HTMLDivElement;

    const editor = MonacoEditor.create(el, {
      value: initialValue,
      language: 'pgsql',
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      padding: {
        top: 20,
      },
    }) as ExtendedEditor;

    editor.resize = () => {
      editor.layout({
        ...editor.getLayoutInfo(),
        height: editor._domElement.offsetHeight,
      });
    };

    editorRef.current = editor;

    addExecuteAction(editor);

    return () => editor.dispose();
  }, []);

  useEffect(() => {
    const editor = editorRef.current as ExtendedEditor;
    enableSuggestions({ editor, tables });
  }, [tables]);

  useVim({ editorRef, statusBarRef });

  return (
    <div className="h-full flex flex-col">
      <div ref={ref} className="flex-grow" />
      <div
        ref={statusBarRef}
        className="flex-shrink-0 h-6 editor-vim-statusbar"
      />
    </div>
  );
}
