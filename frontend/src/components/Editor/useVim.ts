import { ExtendedEditor } from 'components/Editor/Editor';
// eslint-disable-next-line
// @ts-ignore
import { initVimMode } from 'monaco-vim';
import React, { useEffect } from 'react';
import { KeyMod, KeyCode } from 'monaco-editor';

const localStorageKey = 'editorVimModeEnabled';

export const useVim = ({
  statusBarRef,
  editorRef,
}: {
  editorRef: { current?: ExtendedEditor };
  statusBarRef: React.RefObject<HTMLDivElement>;
}) => {
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    let enabled = !!window.localStorage.getItem(localStorageKey);

    let vimMode = enabled && initVimMode(editor, statusBarRef.current);

    editor.addAction({
      id: 'Vim',
      label: 'Vim mode',
      keybindings: [KeyMod.CtrlCmd | KeyCode.KEY_M],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run() {
        if (enabled) {
          enabled = false;
          window.localStorage.removeItem(localStorageKey);
          vimMode?.dispose();
          vimMode = undefined;
          editor.resize();
        } else {
          enabled = true;
          window.localStorage.setItem(localStorageKey, 'true');
          const size = editor.getLayoutInfo();
          editor.layout({
            ...size,
            height: size.height - 24,
          });
          vimMode = initVimMode(editor, statusBarRef.current);
        }
      },
    });

    return () => vimMode?.dispose();
  }, []);
};
