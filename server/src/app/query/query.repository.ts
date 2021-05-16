import { DB } from 'types';

export const executeQuery = async (db: DB, query: string) => {
  const result = await db.query({
    rowMode: 'array',
    text: query,
  });

  return {
    fields: result.fields.map((field) => ({
      name: field.name,
      type: field.dataTypeID,
    })),
    rows: result.rows,
  };
};
