import React, { useEffect, useRef } from 'react';
import Menu from 'components/Common/Menu/Menu';
import { ChevronDown } from 'icons';
import Editor, { ExtendedEditor, useEditorRef } from 'components/Editor/Editor';
import { KeyCode } from 'monaco-editor';
import {
  updateValue,
  useValue,
} from 'components/KeyValueStore/keyValue.service';
import MenuItem from 'components/Common/Menu/MenuItem';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from 'components/Table/TablePage.context';

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

  const historyKey = `${sourceUrl}/${databaseName}/${schemaName}/${tableName}.${conditionType}`;

  const { data: history = [] } = useValue<string[]>(historyKey);
  const historyRef = useRef(history);
  historyRef.current = history;

  const submit = (value: string) => {
    if (value) {
      const history = historyRef.current;
      updateValue(historyKey, [
        value,
        ...history.filter((query) => query !== value),
      ]);
    }
    onSubmitRef.current(value);
  };

  const selectQuery = (query: string) => {
    const editor = editorRef.current as ExtendedEditor;
    editor.setValue(query);
    onSubmitRef.current(query);
  };

  useEffect(() => {
    const editor = editorRef.current as ExtendedEditor;

    const disposable = editorRef.current?.onKeyDown((e) => {
      if (e.keyCode == KeyCode.Enter) {
        // We only prevent enter when the suggest model is not active
        // eslint-disable-next-line
        const obj: any = editor.getContribution(
          'editor.contrib.suggestController',
        );
        if (obj.model.state === 0) {
          e.preventDefault();
          submit(editor.getValue().trim());
        }
      }
    });

    return () => disposable?.dispose();
  }, []);

  const sqlCondition = conditionType === 'where' ? 'WHERE' : 'ORDER BY';

  return (
    <div className="flex w-full">
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
              >
                {query}
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
        />
      </div>
    </div>
  );
}
