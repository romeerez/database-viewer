import React from 'react';
import FormModal from 'components/DataSource/FormModal';
import { useToggle } from 'react-use';

export default function DataSourceFormButton({
  children,
}: {
  children(toggle: () => void): React.ReactNode;
}) {
  const [show, toggle] = useToggle(false);

  return (
    <>
      <FormModal open={show} onClose={toggle} />
      {children(toggle)}
    </>
  );
}
