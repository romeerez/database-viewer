import React from 'react';
import TreeItem from './TreeItem';
import { Functions } from '../../../icons';
import { Procedure as ProcedureType } from '../dataTree.types';

export default function Procedure({
  procedure,
  paddingLeft,
}: {
  procedure: ProcedureType;
  paddingLeft: number;
}) {
  const { name, returnSet, returnType, argTypes, argModes, argNames } =
    procedure;

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
      name={name}
      title={(name) => (
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
      )}
    />
  );
}
