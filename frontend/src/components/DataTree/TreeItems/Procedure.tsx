import React from 'react';
import TreeItem from './TreeItem';
import { Functions } from '../../../icons';
import { getTypeName } from '../../../lib/utils';
import {
  Procedure as ProcedureType,
  SchemaTree,
  ServerTree,
} from '../dataTree.types';

export default function Procedure({
  source,
  schema,
  procedure,
  paddingLeft,
}: {
  source: ServerTree;
  schema: SchemaTree;
  procedure: ProcedureType;
  paddingLeft: number;
}) {
  const {
    name,
    returnSet,
    returnType: returnTypeId,
    argTypes: argTypeIds = [],
    argModes: argModesOrNull,
    argNames,
  } = procedure;

  const argTypes = (argTypeIds ?? []).map((id) =>
    getTypeName(id, schema.types, source.types),
  );
  const returnType = getTypeName(returnTypeId, schema.types, source.types);
  const argModes = argModesOrNull ?? [];

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <div className="relative flex-center mr-2.5">
          <Functions size={16} className="text-accent" />
        </div>
      )}
      title={
        <div className="flex-center">
          {name}
          <div className="text-sm ml-2 text-light-6">
            (
            {argTypes
              .map(
                (type, i) =>
                  `${argNames ? `${argNames[i]} ` : ''}${type}${
                    argModes[i] === 'OUT' ? ' OUT' : ''
                  }`,
              )
              .join(', ')}
            ): {returnSet ? `setof ${returnType}` : returnType}
          </div>
        </div>
      }
    />
  );
}
