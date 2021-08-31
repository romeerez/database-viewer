import React, { useEffect, useRef, useState } from 'react';
import Menu from '../../Common/Menu/Menu';
import { ChevronDown, X } from '../../../icons';
import Editor, { ExtendedEditor, useEditorRef } from '../../Editor/Editor';
import { KeyCode } from 'monaco-editor';
import { updateValue, useValue } from '../../KeyValueStore/keyValue.service';
import MenuItem from '../../Common/Menu/MenuItem';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from '../TablePage.context';
import cn from 'classnames';

export default observer(function Condition({
  conditionType,
  onSubmit,
}: {
  conditionType: 'where' | 'orderBy';
  onSubmit(value: string): void;
}) {
  const { tableDataService } = useTablePageContext();
  const sourceUrl = tableDataService.getSourceUrl();
  if (!sourceUrl) return null;

  return (
    <ConditionInner
      conditionType={conditionType}
      onSubmit={onSubmit}
      sourceUrl={sourceUrl}
    />
  );
});

function ConditionInner({
  conditionType,
  onSubmit,
  sourceUrl,
}: {
  conditionType: 'where' | 'orderBy';
  onSubmit(value: string): void;
  sourceUrl: string;
}) {
  const { tableDataService } = useTablePageContext();
  const { databaseName, schemaName, tableName } = tableDataService.getParams();

  const editorRef = useEditorRef();
  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const conditionKey = `${sourceUrl}/${databaseName}/${schemaName}/${tableName}.${conditionType}`;
  const historyKey = `${conditionKey}.history`;
  const valueKey = `${conditionKey}.value`;

  const { data: history = [] } = useValue<string[]>(historyKey);
  useValue<string>(valueKey, {
    onLoad(value) {
      if (value) editorRef.current?.setValue(value);
    },
  });

  const selectQuery = (query: string) => {
    const editor = editorRef.current as ExtendedEditor;
    editor.setValue(query);
    onSubmitRef.current(query);
  };

  const removeFromHistory = (query: string) => {
    updateValue<string[]>(historyKey, (history = []) =>
      history.filter((item) => item !== query),
    );
  };

  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    const editor = editorRef.current as ExtendedEditor;

    const keyDown = editorRef.current?.onKeyDown((e) => {
      if (e.keyCode == KeyCode.Enter) {
        // We only prevent enter when the suggest model is not active
        // eslint-disable-next-line
        const obj: any = editor.getContribution(
          'editor.contrib.suggestController',
        );
        if (obj.model.state === 0) {
          e.preventDefault();
          const value = editor.getValue().trim();
          if (value) {
            updateValue<string[]>(historyKey, (history = []) => [
              value,
              ...history.filter((query) => query !== value),
            ]);
          }
          onSubmitRef.current(value);
        }
      }
    });

    const change = editorRef.current?.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setHasValue(value.length > 0);
      updateValue<string>(valueKey, () => value);
    });

    return () => {
      keyDown?.dispose();
      change?.dispose();
    };
  }, []);

  const sqlCondition = conditionType === 'where' ? 'WHERE' : 'ORDER BY';

  const clear = () => editorRef.current?.setValue('');

  return (
    <div className="flex w-full relative">
      <Menu
        className="flex-shrink-0"
        button={(toggle) => (
          <button
            type="button"
            onClick={history.length > 0 ? toggle : undefined}
            className="uppercase py-2 px-4 pr-3 text-sm flex items-center border-r border-dark-3"
          >
            {sqlCondition}
            <ChevronDown
              size={16}
              className={history.length > 0 ? undefined : 'opacity-20'}
            />
          </button>
        )}
      >
        {(toggle) => (
          <>
            {history.map((query, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  toggle();
                  selectQuery(query);
                }}
                className="font-mono text-xs justify-between pr-1"
              >
                {query}
                <button
                  className="h-7 w-7 ml-2 flex-center rounded duration-200 transition hover:bg-dark-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(query);
                  }}
                >
                  <X size={20} />
                </button>
              </MenuItem>
            ))}
          </>
        )}
      </Menu>
      <div className="h-full w-0 flex-grow">
        <Editor
          editorRef={editorRef}
          disableVim
          paddingTop={9}
          paddingBottom={0}
          singleLine
          suggestionsPrepend={`SELECT * FROM \`${tableName}\` ${sqlCondition} `}
          sourceUrl={sourceUrl}
          databaseName={databaseName}
          schemaName={schemaName}
          highlightCurrentLine={false}
          hideVerticalScrollBar
        />
      </div>
      <button
        className={cn(
          'h-8 w-8 absolute top-0.5 right-2 flex-center transition duration-200',
          !hasValue && 'opacity-0',
        )}
        onClick={clear}
      >
        <X size={20} />
      </button>
    </div>
  );
}
