import { makeAutoObservable } from 'mobx';

const localStorageKey = 'darkMode';
let darkMode = window.localStorage.getItem(localStorageKey);

if (!darkMode && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkMode = 'yes';
}

export const themeSwitcher = makeAutoObservable({
  dark: darkMode === 'yes',
  setDark(dark: boolean) {
    this.dark = dark;
    window.localStorage.setItem(localStorageKey, dark ? 'yes' : 'no');
  },
});
