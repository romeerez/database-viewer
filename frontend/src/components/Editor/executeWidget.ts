import React, { useState } from 'react';
import * as monaco from 'monaco-editor';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { parseSql } from 'sql-autocomplete';

const widgetId = 'executeQuery.widget';

type Location = {
  type: string;
  location: {
    first_line: number;
    last_line: number;
    first_column: number;
    last_column: number;
  };
};

type Statement = Location['location'] & { query: string };

export const useExecuteWidget = ({
  executeQueryRef,
}: {
  executeQueryRef: React.MutableRefObject<
    undefined | ((query: string) => void)
  >;
}) => {
  const [widgetRef] = useState<{ current: HTMLDivElement | null }>({
    current: null,
  });

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
        let fullText = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 0,
          endLineNumber: fullRange.endLineNumber,
          endColumn: fullRange.endColumn,
        });

        if (!fullText.match(/;\s*$/)) fullText += ';';

        const parsedLocations = parseSql(fullText, '', false)
          .locations as Location[];
        const len = parsedLocations.length;

        const locations: Location['location'][] = [];
        let currentLocation: Location['location'] | undefined;

        for (let i = 0; i < len; i++) {
          const statement = parsedLocations[i];
          if (statement.type === 'statement') {
            currentLocation = statement.location;
            if (
              currentLocation.first_line > currentLine ||
              (currentLocation.first_line === currentLine &&
                currentLocation.first_column > currentColumn)
            )
              break;

            locations.push(currentLocation);
          } else if (currentLocation) {
            currentLocation.last_line = statement.location.last_line;
            currentLocation.last_column = statement.location.last_column;
          }
        }

        if (locations.length === 0 && parsedLocations.length) {
          const first = parsedLocations[0].location;
          const last = parsedLocations[len - 1].location;
          locations.push({
            first_line: first.first_line,
            first_column: first.first_column,
            last_line: last.last_line,
            last_column: last.last_column,
          });
        }

        if (locations.length === 0) return;

        const statements: Statement[] = [];
        for (const location of locations) {
          location.last_column++;

          const statement: Statement = {
            ...location,
            query: model.getValueInRange({
              startLineNumber: location.first_line,
              startColumn: location.first_column,
              endLineNumber: location.last_line,
              endColumn: location.last_column,
            }),
          };

          const match = statement.query.match(/^[;\s]+/);
          if (match) {
            const stripped = statement.query.slice(0, match[0].length);
            const arr = stripped.split(/\n/);
            statement.first_line += arr.length - 1;
            statement.first_column = arr[arr.length - 1].length;

            if (
              statement.first_line > currentLine ||
              (statement.first_line === currentLine &&
                statement.first_column > currentColumn)
            )
              break;

            statement.query = statement.query.slice(match[0].length);
          }

          statements.push(statement);
        }

        statements.reverse();

        editor.addContentWidget({
          getId() {
            return widgetId;
          },
          getDomNode() {
            const div = document.createElement('div');
            widgetRef.current = div;
            div.id = widgetId;
            div.className =
              'text-md bg-primary-gradient-lighter rounded py-1 shadow';

            const close = () => {
              document.removeEventListener('mousedown', listener);
              div.remove();
              widgetRef.current = null;
              editor.focus();
            };

            const listener = (e: MouseEvent) => {
              if (!(e.target as HTMLDivElement).closest(`#${widgetId}`))
                close();
            };
            document.addEventListener('mousedown', listener);

            div.onkeydown = (e) => {
              if (e.key === 'Escape') {
                close();
              } else if (e.key === 'ArrowDown') {
                const focused = div.querySelector(':focus');
                if (focused?.nextElementSibling) {
                  (focused.nextElementSibling as HTMLButtonElement).focus();
                } else {
                  (div.firstElementChild as HTMLButtonElement).focus();
                }
              } else if (e.key === 'ArrowUp') {
                const focused = div.querySelector(':focus');
                if (focused?.previousElementSibling) {
                  (focused.previousElementSibling as HTMLButtonElement).focus();
                } else {
                  (div.lastElementChild as HTMLButtonElement).focus();
                }
              }
            };

            statements.forEach((statement) => {
              const button = document.createElement('button');
              const { query } = statement;

              button.className =
                'h-8 whitespace-nowrap px-3 text-light-3 hover:text-light-1 hover:bg-lighter';
              button.textContent = query;
              button.onfocus = () => {
                editor.setSelection({
                  startLineNumber: statement.first_line,
                  startColumn: statement.first_column,
                  endLineNumber: statement.last_line,
                  endColumn: statement.last_column,
                });
              };
              button.onclick = () => {
                close();
                if (executeQueryRef.current) executeQueryRef.current(query);
              };
              div.appendChild(button);
            });

            return div;
          },
          afterRender() {
            const el = widgetRef.current as HTMLDivElement;
            (el.firstElementChild as HTMLButtonElement).focus();
          },
          getPosition: function () {
            return {
              position: editor.getPosition(),
              preference: [
                monaco.editor.ContentWidgetPositionPreference.ABOVE,
                monaco.editor.ContentWidgetPositionPreference.BELOW,
              ],
            };
          },
        });
      },
    });
  };

  return { addExecuteAction };
};
