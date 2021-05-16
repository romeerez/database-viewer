import React, { useState } from 'react';
import Menu from 'components/Common/Menu/Menu';
import { Menu as MenuIcon } from 'icons';
import MenuItem from 'components/Common/Menu/MenuItem';
import Modal from 'components/Common/Modal/Modal';
import ConnectForm from 'components/DataSource/Connect/ConnectForm';
import { useToggle } from 'react-use';
import Toggle from 'components/Common/Form/Toggle/Toggle';
import { themeSwitcher } from 'components/Theme/themeSwitcher';
import { useObserver } from 'mobx-react-lite';

export default function SidebarMenu() {
  const [showConnectModal, toggleConnectModal] = useToggle(false);
  const darkMode = useObserver(() => themeSwitcher.dark);

  return (
    <>
      <Modal open={showConnectModal} onClose={toggleConnectModal}>
        {(onClose) => <ConnectForm onClose={onClose} />}
      </Modal>
      <Menu
        menuClass="mt-2"
        menuStyle={{
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        button={(toggle) => (
          <button onClick={toggle}>
            <MenuIcon size={24} />
          </button>
        )}
      >
        {(toggle) => (
          <>
            <MenuItem
              className="whitespace-nowrap"
              onClick={() => {
                toggle();
                toggleConnectModal();
              }}
            >
              Add new connection
            </MenuItem>
            <MenuItem>
              <Toggle
                checked={darkMode}
                onChange={(dark) => themeSwitcher.setDark(dark)}
              >
                Dark Mode
              </Toggle>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
