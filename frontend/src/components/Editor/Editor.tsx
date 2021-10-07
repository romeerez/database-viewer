import React, { useEffect, useRef, useState } from 'react';
import { editor as MonacoEditor } from 'monaco-editor';
import { enableSuggestions } from './suggestions';
import { useExecuteWidget } from './executeWidget';
import { useVim } from './useVim';
import { useOnWindowResize } from '../../lib/onWindowResize';
import cn from 'classnames';
import style from './style.module.css';
import { useLazyLoadServerTree } from '../../api/server';

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

const LINE_HEIGHT = 19;

export default function Editor({
  editorRef,
  sourceUrl,
  databaseName,
  schemaName = 'public',
  initialValue,
  executeQuery,
  disableVim,
  paddingTop = 20,
  paddingBottom = 20,
  singleLine,
  suggestionsPrepend,
  autoHeight,
  highlightCurrentLine = true,
  hideVerticalScrollBar,
}: {
  editorRef: { current?: ExtendedEditor };
  sourceUrl?: string;
  databaseName?: string;
  schemaName?: string;
  initialValue?: string;
  executeQuery?(query: string): void;
  disableVim?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  singleLine?: boolean;
  suggestionsPrepend?: string;
  autoHeight?: boolean;
  highlightCurrentLine?: boolean;
  hideVerticalScrollBar?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);
  const executeQueryRef = useRef(executeQuery);
  executeQueryRef.current = executeQuery;

  const { addExecuteAction } = useExecuteWidget({ executeQueryRef });

  useEffect(() => {
    const el = ref.current as HTMLDivElement;

    const options: MonacoEditor.IStandaloneEditorConstructionOptions = {
      value: initialValue,
      language: 'pgsql',
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      padding: {
        top: paddingTop,
        bottom: paddingBottom,
      },
      ...(hideVerticalScrollBar && {
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          vertical: 'hidden',
        },
        overviewRulerBorder: false,
      }),
    };

    if (singleLine) {
      Object.assign(options, {
        lineNumbers: 'off',
        lineNumbersMinChars: 0,
        folding: false,
      });
    }

    const editor = MonacoEditor.create(el, options) as ExtendedEditor;

    editorRef.current = editor;

    if (executeQuery) addExecuteAction(editor);

    return () => editor.dispose();
  }, []);

  useVim({ editorRef, statusBarRef, disabled: disableVim });

  useOnWindowResize(() => editorRef.current?.resize());

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    if (autoHeight) {
      const model = editor.getModel();
      if (!model) return;

      editor.resize = () => {
        editor.layout({
          width: editor._domElement.offsetWidth,
          height:
            model.getLineCount() * LINE_HEIGHT + paddingTop + paddingBottom,
        });
      };

      const disposable = editor.onDidChangeModelContent(() => editor.resize());

      editor.resize();

      return () => disposable.dispose();
    }

    editor.resize = () => {
      editor.layout({
        width: editor._domElement.offsetWidth,
        height: editor._domElement.offsetHeight,
      });
    };
  }, [autoHeight, paddingTop]);

  const tables = useLoadTables({
    sourceUrl,
    databaseName,
    schemaName,
  });

  useEffect(() => {
    const editor = editorRef.current as ExtendedEditor;
    enableSuggestions({ editor, tables, prepend: suggestionsPrepend });
  }, [tables]);

  return (
    <div className="h-full flex flex-col">
      <div
        ref={ref}
        className={cn(
          'flex-grow',
          style.editor,
          !highlightCurrentLine && style.disableCurrentLineHighlight,
        )}
      />
      {!disableVim && (
        <div
          ref={statusBarRef}
          className={cn('flex-shrink-0 h-6', style.vimStatusBar)}
        />
      )}
    </div>
  );
}

const useLoadTables = ({
  sourceUrl,
  databaseName,
  schemaName,
}: {
  sourceUrl?: string;
  databaseName?: string;
  schemaName?: string;
}) => {
  const [loadServerTree, { data }] = useLazyLoadServerTree();
  const server = data?.server;
  const database = databaseName
    ? server?.databases.find((database) => database.name === databaseName)
    : undefined;
  const schema = schemaName
    ? database?.schemas.find((schema) => schema.name === schemaName)
    : undefined;
  const tables = schema?.tables;

  useEffect(() => {
    if (sourceUrl) {
      loadServerTree(sourceUrl);
    }
  }, [loadServerTree, sourceUrl]);

  return tables;
};
