import React from 'react';
import Toggle from '../../Common/Form/Toggle/Toggle';

export default function ToggleEmpty({
  isRaw,
  setIsRaw,
}: {
  isRaw: boolean;
  setIsRaw(isRaw: boolean): void;
}) {
  return (
    <label className="absolute top-full mt-1 flex items-center text-sm bg-dark-4 py-2 px-4 rounded-b select-none duration-200 transform">
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
