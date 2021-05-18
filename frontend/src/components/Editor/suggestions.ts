import * as monaco from 'monaco-editor';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { parseSql } from 'sql-autocomplete';

type Tables = { name: string; columns: { name: string }[] }[];

const popularKeywords: Record<string, true> = {
  SELECT: true,
  INSERT: true,
  UPDATE: true,
  DELETE: true,
};

monaco.languages.registerCompletionItemProvider('pgsql', {
  triggerCharacters: [' ', '.'],
  provideCompletionItems: (model, position) => {
    const { lineNumber, column } = position;

    const textBeforePointer = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 0,
      endLineNumber: lineNumber,
      endColumn: column,
    });

    const result = parseSql(textBeforePointer, '', false);

    const tokens = textBeforePointer.split(/\s+/);
    const lastToken = tokens[tokens.length - 1];

    const suggestions: monaco.languages.CompletionItem[] = [];
    let sortIndex = 0;

    const { tables } = model as unknown as { tables?: Tables };

    if (result.suggestColumns?.tables && tables) {
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
            kind: monaco.languages.CompletionItemKind.Variable,
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

    if (result.suggestTables && tables) {
      suggestions.push(
        ...tables.map((table, i) => ({
          label: table.name,
          insertText: table.name,
          kind: monaco.languages.CompletionItemKind.Variable,
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
      ({ value: a }: { value: string }, { value: b }: { value: string }) => {
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
          kind: monaco.languages.CompletionItemKind.Variable,
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

export const enableSuggestions = ({
  editor,
  tables,
}: {
  editor: monaco.editor.IStandaloneCodeEditor;
  tables?: Tables;
}) => {
  const model = editor.getModel() as unknown as { tables?: Tables };
  model.tables = tables;
};
