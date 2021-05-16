import React, { useEffect, useRef } from 'react';
import { editor, languages } from 'monaco-editor';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { parseSql } from 'sql-autocomplete';
import { DataSourceInLocalStoreWithDriver } from 'components/DataSource/types';
import { useDataTree } from 'components/DataTree/dataTree.service';

editor.setTheme('vs-dark');

const popularKeywords: Record<string, true> = {
  SELECT: true,
  INSERT: true,
  UPDATE: true,
  DELETE: true,
};

export default function Editor({
  source,
  databaseName,
  schemaName,
}: {
  source?: DataSourceInLocalStoreWithDriver;
  databaseName: string;
  schemaName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { tree } = useDataTree();
  const sourceUrl = source?.url;
  const dataSource = sourceUrl
    ? tree?.dataSources.find((source) => source.url === sourceUrl)
    : undefined;
  const database = dataSource?.databases.find(
    (database) => database.name === databaseName,
  );
  const schema = database?.schemas.find((schema) => schema.name === schemaName);
  const tables = schema?.tables;

  useEffect(() => {
    if (!tables) return;

    const el = ref.current as HTMLDivElement;

    languages.registerCompletionItemProvider('sql', {
      triggerCharacters: [' ', '.'],
      provideCompletionItems: (model, position) => {
        const { lineNumber, column } = position;

        const textBeforePointer = model.getValueInRange({
          startLineNumber: 0,
          startColumn: 0,
          endLineNumber: lineNumber,
          endColumn: column,
        });

        const result = parseSql(textBeforePointer, '', false);

        const tokens = textBeforePointer.split(/\s+/);
        const lastToken = tokens[tokens.length - 1];

        const suggestions: languages.CompletionItem[] = [];
        let sortIndex = 0;

        if (result.suggestColumns?.tables) {
          for (const suggestTable of result.suggestColumns.tables) {
            const { identifierChain } = suggestTable;
            if (!identifierChain) continue;
            if (identifierChain.length !== 1) continue;

            const { name } = identifierChain[0];
            if (!name) continue;

            const table = tables.find((table) => table.name === name);
            if (!table) continue;

            suggestions.push(
              ...table.columns.map((col, i) => ({
                label: col.name,
                insertText: col.name,
                kind: languages.CompletionItemKind.Variable,
                sortText: String.fromCharCode(i),
                range: {
                  startLineNumber: lineNumber,
                  startColumn: column - lastToken.length,
                  endLineNumber: lineNumber,
                  endColumn: column,
                },
              })),
            );

            sortIndex += table.columns.length;
          }
        }

        if (result.suggestTables) {
          suggestions.push(
            ...tables.map((table, i) => ({
              label: table.name,
              insertText: table.name,
              kind: languages.CompletionItemKind.Variable,
              sortText: String.fromCharCode(i),
              range: {
                startLineNumber: lineNumber,
                startColumn: column - lastToken.length,
                endLineNumber: lineNumber,
                endColumn: column,
              },
            })),
          );

          sortIndex += tables.length;
        }

        const keywords = result.suggestKeywords?.sort(
          (
            { value: a }: { value: string },
            { value: b }: { value: string },
          ) => {
            const aStarts = a.startsWith(lastToken);
            if (aStarts && b.startsWith(lastToken)) {
              return popularKeywords[a] ? -1 : 0;
            }
            return aStarts ? -1 : 0;
          },
        );

        if (keywords) {
          suggestions.push(
            ...keywords.map(({ value }: { value: string }, i: number) => ({
              label: value,
              insertText: value,
              kind: languages.CompletionItemKind.Variable,
              sortText: String.fromCharCode(sortIndex + i),
              range: {
                startLineNumber: lineNumber,
                startColumn: column - lastToken.length,
                endLineNumber: lineNumber,
                endColumn: column,
              },
            })),
          );
        }

        return {
          suggestions,
        };
      },
    });

    const instance = editor.create(el, {
      value: 'SELECT * FROM users',
      language: 'sql',
      minimap: {
        enabled: false,
      },
    });

    return () => {
      instance.getModel()?.dispose();
    };
  }, [tables]);

  return (
    <div className="h-1/4 flex-shrink-0">
      <div ref={ref} className="h-full" />;
    </div>
  );
}
