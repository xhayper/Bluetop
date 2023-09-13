import { app, shell, nativeTheme, BrowserWindow } from 'electron';
import Store from 'electron-store';
import path from 'node:path';

if (!app.requestSingleInstanceLock()) app.quit();

const configStore = new Store<{
  winBounds?: { width?: number; height?: number; x?: number; y?: number };
}>();

const createWindow = () => {
  const { width, height, x, y } = configStore.get('winBounds') ?? {};

  const mainWindow = new BrowserWindow({
    width: width ?? 1280,
    height: height ?? 720,
    x,
    y,

    title: 'Bluetop',
    icon: path.join(__dirname, '../', 'build', 'icon.ico'),
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#000000' : '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.setMenu(null);

  mainWindow.on('close', () => {
    configStore.set('winBounds', mainWindow.getBounds());
  });

  mainWindow.on('page-title-updated', (event: any) => {
    event.preventDefault();
  });

  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') mainWindow.webContents.toggleDevTools();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL(path.join(__dirname, '../', 'index.html'));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
