import { useTablePageContext } from '../TablePage.context';
import { useEditorRef } from '../../Editor/Editor';
import { buildTransaction } from '../../../lib/queryBuilder';

export const usePreviewChangesService = () => {
  const { tableDataService, dataChangesService } = useTablePageContext();
  const editorRef = useEditorRef();

  const removedRows = dataChangesService.getRemovedRows();
  const rowChanges = dataChangesService.getRowChanges();
  const newRows = dataChangesService.getNewRows();
  const primaryColumns = tableDataService.getPrimaryColumns();
  const { schemaName, tableName } = tableDataService.getParams();
  const fields = tableDataService.getFields();
  const defaults = tableDataService.getDefaults();

  return {
    editorRef,
    getValue() {
      if (!fields || !defaults) return '';

      return buildTransaction({
        schemaName,
        tableName,
        primaryColumns,
        fields,
        defaults,
        removedRows,
        rowChanges,
        newRows,
      });
    },
  };
};
