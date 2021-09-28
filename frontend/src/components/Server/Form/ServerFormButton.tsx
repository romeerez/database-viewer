import React from 'react';
import FormModal from '../../../components/Server/FormModal';
import { useToggle } from 'react-use';

export default function ServerFormButton({
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
