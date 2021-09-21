import React, { useEffect } from 'react';
import { useTablePageContext } from '../TablePage.context';
import cn from 'classnames';
import ErrorAlert from '../../Common/ErrorAlert';

export default function Error({ isMain }: { isMain?: boolean }) {
  const { errorService } = useTablePageContext();
  const error = errorService.use('error');
  const show = errorService.use('showMainError') || !isMain;

  useEffect(() => {
    if (!isMain) {
      errorService.setShowMainError(false);
      return () => errorService.setShowMainError(true);
    }
  }, [errorService, isMain]);

  return (
    <ErrorAlert
      error={error}
      className={cn(
        'duration-200 transition',
        !show && 'transform translate-y-full',
      )}
      onClose={() => errorService.setError()}
    />
  );
}
