import React, { useEffect, useState } from 'react';
import Toggle from '../../../components/Common/Form/Toggle/Toggle';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from '../../../components/Table/TablePage.context';
import cn from 'classnames';

export default observer(function ToggleEmpty() {
  const { floatingInputService } = useTablePageContext();
  const value = floatingInputService.getValue();

  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (!value) setIsHidden(false);
    else if (!isHidden) {
      setIsHidden(true);
    }
  }, [value]);

  const onTransitionEnd = () => {
    if (value) setIsHidden(true);
  };

  const onMouseDown = () => floatingInputService.setPreventBlur(true);

  const onMouseUp = () => floatingInputService.setPreventBlur(false);

  const onNullChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    floatingInputService.setIsEmptyAllowed(e.target.checked);

  const cancelBlur = floatingInputService.cancelBlur;

  return (
    <label
      className={cn(
        'absolute top-full flex items-center text-sm bg-dark-4 py-2 px-4 rounded-b select-none duration-200 transform',
        value && 'opacity-0 -translate-y-2 pointer-events-none',
      )}
      onTransitionEnd={onTransitionEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      hidden={isHidden}
    >
      null
      <Toggle
        inputProps={{
          onFocus: cancelBlur,
          onChange: onNullChange,
        }}
        className="mx-2"
        checked={floatingInputService.getIsNullAllowed()}
      />
      empty
    </label>
  );
});
