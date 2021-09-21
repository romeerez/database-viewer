import { createStore } from 'jastaman';

const localStorageKey = 'darkMode';
let darkMode = window.localStorage.getItem(localStorageKey);

if (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkMode = 'yes';
}

export const themeSwitcher = createStore({
  state: {
    dark: darkMode === 'yes',
  },
  setDark(dark: boolean) {
    themeSwitcher.set({ dark });
    window.localStorage.setItem(localStorageKey, dark ? 'yes' : 'no');
  },
});
