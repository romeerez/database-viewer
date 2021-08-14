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

  return {
    editorRef,
    getValue() {
      if (!fields) return '';

      return buildTransaction({
        schemaName,
        tableName,
        primaryColumns,
        fields,
        removedRows,
        rowChanges,
        newRows,
      });
    },
  };
};
