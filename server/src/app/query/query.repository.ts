import { DB } from 'types';

export const executeQuery = async (db: DB, query: string) => {
  const { fields, result } = await db.arraysWithFields<string[][]>(query);

  return {
    fields: fields.map((field) => ({
      name: field.name,
      type: field.dataTypeID,
    })),
    rows: result,
  };
};
