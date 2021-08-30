import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import { endConnections } from './db';

const env = import.meta.env;

let mainWindow: BrowserWindow | null = null;

preventSecondInstance();
app.disableHardwareAcceleration();
quitWhenClosed();

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
});

app.on('quit', () => {
  endConnections();
});

function preventSecondInstance() {
  const isSingleInstance = app.requestSingleInstanceLock();

  if (!isSingleInstance) {
    app.quit();
    process.exit(0);
  }

  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      preload: join(__dirname, '../../preload/dist/index.cjs'),
      contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
      enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
    },
  });
  mainWindow.maximize();

  /**
   * If you install `show: true` then it can cause issues when trying to close the window.
   * Use `show: false` and listener events `ready-to-show` to fix these issues.
   *
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (env.MODE === 'development') {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * URL for main window.
   * Vite dev server for development.
   * `file://../renderer/index.html` for production and test
   */
  const pageUrl =
    env.MODE === 'development'
      ? (env.VITE_DEV_SERVER_URL as string)
      : new URL(
          '../renderer/dist/index.html',
          'file://' + __dirname,
        ).toString();

  await mainWindow.loadURL(pageUrl);
}

function quitWhenClosed() {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

async function setupAutoUpdater() {
  if (env.PROD) {
    const { autoUpdater } = await import('electron-updater');
    await autoUpdater.checkForUpdatesAndNotify();
  }
}
