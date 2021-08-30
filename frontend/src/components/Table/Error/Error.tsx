import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from '../TablePage.context';
import { X } from '../../../icons';
import cn from 'classnames';

export default observer(function Error({ isMain }: { isMain?: boolean }) {
  const { errorService } = useTablePageContext();
  const error = errorService.getError();
  const show = errorService.getShowMainError() || !isMain;

  useEffect(() => {
    if (!isMain) {
      errorService.setShowMainError(false);
      return () => errorService.setShowMainError(true);
    }
  }, [isMain]);

  return !error ? null : (
    <div
      className={cn(
        'bg-error-dark px-5 py-3 relative duration-200 transition',
        !show && 'transform translate-y-full',
      )}
    >
      <button
        type="button"
        className="flex absolute top-3 right-3"
        onClick={() => errorService.setError()}
      >
        <X size={24} />
      </button>
      {error}
    </div>
  );
});
