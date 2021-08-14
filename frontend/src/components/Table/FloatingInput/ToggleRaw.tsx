import React from 'react';
import Toggle from '../../../components/Common/Form/Toggle/Toggle';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from '../TablePage.context';

export default observer(function ToggleEmpty() {
  const { floatingInputService } = useTablePageContext();

  const onMouseDown = () => floatingInputService.setPreventBlur(true);

  const onMouseUp = () => floatingInputService.setPreventBlur(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    floatingInputService.setIsRaw(!e.target.checked);

  const cancelBlur = floatingInputService.cancelBlur;

  return (
    <label
      className="absolute top-full mt-1 flex items-center text-sm bg-dark-4 py-2 px-4 rounded-b select-none duration-200 transform"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      raw
      <Toggle
        inputProps={{
          onFocus: cancelBlur,
          onChange,
        }}
        className="mx-2"
        checked={!floatingInputService.getIsRaw()}
      />
      value
    </label>
  );
});
