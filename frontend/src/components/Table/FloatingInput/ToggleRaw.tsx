import React from 'react';
import Toggle from '../../Common/Form/Toggle/Toggle';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from '../TablePage.context';

export default observer(function ToggleEmpty() {
  const { floatingInputService } = useTablePageContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    floatingInputService.setIsRaw(!e.target.checked);

  return (
    <label className="absolute top-full mt-1 flex items-center text-sm bg-dark-4 py-2 px-4 rounded-b select-none duration-200 transform">
      raw
      <Toggle
        inputProps={{
          onChange,
        }}
        className="mx-2"
        checked={!floatingInputService.getIsRaw()}
      />
      value
    </label>
  );
});
