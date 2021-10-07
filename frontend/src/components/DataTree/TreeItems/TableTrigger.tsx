import React from 'react';
import TreeItem from '../TreeItems/TreeItem';
import { Trigger as TriggerIcon } from '../../../icons';
import { TableTrigger as TriggerType } from '../dataTree.types';

const sortWeights: Record<string, number> = {
  insert: 0,
  update: 1,
  delete: 2,
};

export default function TableTrigger({
  paddingLeft,
  trigger,
}: {
  paddingLeft: number;
  trigger: TriggerType;
}) {
  const { name, activation, events, definition } = trigger;

  const functionName = definition.match(/EXECUTE FUNCTION ([^(]+)/)?.[1];

  return (
    <TreeItem
      key={name}
      paddingLeft={paddingLeft}
      buttonStyle={{ zIndex: 6 }}
      icon={() => (
        <div className="relative flex-center mr-2.5">
          <TriggerIcon size={16} className="text-accent" />
        </div>
      )}
      name={name}
      title={(name) => (
        <div className="flex-center">
          {name}
          <div className="text-sm ml-2 text-light-6">
            {activation.toLowerCase()}{' '}
            {events
              .map((event) => event.toLowerCase())
              .sort((a, b) => sortWeights[a] - sortWeights[b])
              .join(', ')}
            {functionName && ` → ${functionName}`}
          </div>
        </div>
      )}
    />
  );
}
