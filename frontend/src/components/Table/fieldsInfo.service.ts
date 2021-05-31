import { useDataTree } from 'components/DataTree/dataTree.service';
import { Field, GetDataTreeQuery } from 'generated/graphql';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ParamsState } from 'components/Table/params.service';
import { DataState } from 'components/Table/data.state';

export type FieldInfo = {
  name: string;
  type: string;
  isNullable: boolean;
  default?: string;
};

export const useFieldsInfo = ({
  paramsState,
  dataState,
}: {
  paramsState: ParamsState;
  dataState: DataState;
}) => {
  const { tree } = useDataTree();
  const [fieldsInfo, setFieldsInfo] = useState<FieldInfo[]>();

  useEffect(() => {
    if (!tree || !dataState.fields || !paramsState.sourceUrl) return;

    try {
      const fieldsInfo = getFieldsInfo({
        tree,
        paramsState,
        fields: dataState.fields,
      });
      setFieldsInfo(fieldsInfo);
    } catch (error) {
      toast(error.message, { type: 'error' });
    }
  }, [tree, dataState.fields, paramsState.sourceUrl]);

  return fieldsInfo;
};

const getFieldsInfo = ({
  tree,
  paramsState: { sourceUrl, databaseName, schemaName, tableName },
  fields,
}: {
  tree: GetDataTreeQuery;
  paramsState: ParamsState;
  fields: Field[];
}) => {
  const source = tree.dataSources.find((source) => source.url === sourceUrl);
  if (!source) return;

  const database = source.databases.find(
    (database) => database.name === databaseName,
  );
  if (!database) return;

  const schema = database.schemas.find((schema) => schema.name === schemaName);
  if (!schema) return;

  const table = schema.tables.find((table) => table.name === tableName);
  if (!table) return;

  const sourceTypes = source.types;
  const schemaTypes = schema.types;

  return fields.map(({ name, type: typeId }) => {
    const schemaType = schemaTypes.find((type) => type.id === typeId);
    const type = schemaType || sourceTypes.find((type) => type.id === typeId);
    if (!type) {
      throw new Error(`Can't find type for ${name} column`);
    }

    const column = table.columns.find((column) => column.name === name);
    if (!column) {
      throw new Error(`Can't definition of ${name} column`);
    }

    return {
      name,
      type: type.name,
      isNullable: !column.isNullable,
      default: column.default || undefined,
    };
  });
};
