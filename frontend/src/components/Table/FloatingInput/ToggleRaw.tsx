import React from 'react';
import Toggle from '../../Common/Form/Toggle/Toggle';
import cn from 'classnames';

export default function ToggleEmpty({
  isRaw,
  setIsRaw,
  className,
}: {
  isRaw: boolean;
  setIsRaw(isRaw: boolean): void;
  className?: string;
}) {
  return (
    <label
      className={cn(
        'flex items-center text-sm bg-dark-4 py-2 px-4 rounded-b select-none duration-200 transform',
        className,
      )}
    >
      raw
      <Toggle
        inputProps={{
          onChange(e) {
            setIsRaw(!e.target.checked);
          },
        }}
        className="mx-2"
        checked={!isRaw}
      />
      value
    </label>
  );
}
