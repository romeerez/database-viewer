import React from 'react';
import Menu from 'components/Common/Menu/Menu';
import { Menu as MenuIcon } from 'icons';
import MenuItem from 'components/Common/Menu/MenuItem';
import Toggle from 'components/Common/Form/Toggle/Toggle';
import { themeSwitcher } from 'components/Theme/themeSwitcher';
import { useObserver } from 'mobx-react-lite';

export default function SidebarMenu() {
  const darkMode = useObserver(() => themeSwitcher.dark);

  return (
    <>
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
        {() => (
          <>
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
