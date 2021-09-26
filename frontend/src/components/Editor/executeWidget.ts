import React from 'react';
import * as monaco from 'monaco-editor';

export const useExecuteWidget = ({
  executeQueryRef,
}: {
  executeQueryRef: React.MutableRefObject<
    undefined | ((query: string) => void)
  >;
}) => {
  const addExecuteAction = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.addAction({
      id: 'executeQuery',
      label: 'Execute Query',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run(editor) {
        const position = editor.getPosition();
        if (!position) return;

        const model = editor.getModel();
        if (!model) return;

        const currentLine = position.lineNumber;
        const currentColumn = position.column;

        const fullRange = model.getFullModelRange();
        const fullText = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 0,
          endLineNumber: fullRange.endLineNumber,
          endColumn: fullRange.endColumn,
        });

        const statements = fullText.split(';');
        if (statements[statements.length - 1].trim().length === 0) {
          statements.pop();
        }

        const len = statements.length;
        let line = 1;
        let statement: string | undefined;
        for (let i = 0; i < len; i++) {
          const lines = statements[i].split(/\n/g);
          const lastIndex = lines.length - 1;
          line += lastIndex;
          if (
            line > currentLine ||
            (line === currentLine &&
              // + 2 means to grab the case when cursor is right after ;
              lines[lastIndex].length + 2 >= currentColumn)
          ) {
            statement = statements[i];
            break;
          }
        }
        if (statement === undefined && len > 0) {
          statement = statements[len - 1];
        }

        if (statement !== undefined && executeQueryRef.current)
          executeQueryRef.current(statement);
      },
    });
  };

  return { addExecuteAction };
};

// Choosing multiple statements with widget was here, see in git history if you need it
