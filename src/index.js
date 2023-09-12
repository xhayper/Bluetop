const { app, shell, BrowserWindow } = require('electron'),
  Store = require('electron-store'),
  path = require('node:path');

if (!app.requestSingleInstanceLock()) app.quit();

const configStore = new Store();

const createWindow = () => {
  const previousBounds = configStore.get('winBounds');

  const mainWindow = new BrowserWindow({
    ...(previousBounds ?? { width: 1280, height: 720 }),
    title: 'Bluetop',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.setMenu(null);

  mainWindow.on('close', () => {
    configStore.set('winBounds', mainWindow.getBounds());
  });

  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.loadURL('https://bsky.app/');
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
