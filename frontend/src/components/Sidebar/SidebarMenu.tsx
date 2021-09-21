import React from 'react';
import Menu from '../../components/Common/Menu/Menu';
import { Menu as MenuIcon } from '../../icons';
import MenuItem from '../../components/Common/Menu/MenuItem';
import Toggle from '../../components/Common/Form/Toggle/Toggle';
import { themeSwitcher } from '../Theme/themeSwitcher';

export default function SidebarMenu() {
  const darkMode = themeSwitcher.use('dark');

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
              <label className="w-full flex items-center justify-between cursor-pointer">
                <div className="mr-2">Dark Mode</div>
                <Toggle
                  checked={darkMode}
                  onChange={(dark) => themeSwitcher.setDark(dark)}
                  toggleColor
                />
              </label>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
