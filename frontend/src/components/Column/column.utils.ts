import { TableTree } from '../DataTree/dataTree.service';

export const isColumnIndexed = (table: TableTree, name: string) =>
  table.indices.some((index) => index.columnNames.includes(name));

export const isColumnPrimary = (
  table: TableTree,
  name: string,
  isIndexed = isColumnIndexed(table, name),
) =>
  isIndexed &&
  table.indices.some(
    (index) => index.isPrimary && index.columnNames.includes(name),
  );

export const columnHasForeignKey = (table: TableTree, name: string) =>
  table.foreignKeys.some((key) => key.columnNames.includes(name));
