/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');

const { app, Menu } = electron;
const { BrowserWindow, ipcMain } = electron;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const os = require('os-utils');

app.disableHardwareAcceleration();

let mainWindow;

const isOpenDevTools = (webContents) => {
  if (webContents.isDevToolsOpened()) {
    webContents.closeDevTools();
    return false;
  }
  webContents.openDevTools();
  return true;
};
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.resolve(__dirname, 'preload.js'),
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
    simpleFullscreen: true,
    icon: `${__dirname}/icon512x512.png`,
    title: 'MCC Testbed',
  });

  if (process.platform === 'darwin') {
    app.dock.setIcon(`${__dirname}/icon512x512.png`);
  }

  const loadUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true,
      });
  mainWindow.loadURL(loadUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.maximize();
  mainWindow.setMenu(null);
  // os.cpuUsage((v) => {
  //   // app.
  //   const used = process.memoryUsage().heapUsed / 1024 / 1024;
  //   mainWindow.webContents.send('appMetrics', app.getAppMetrics());
  //   mainWindow.webContents.send('node', `${Math.round(used * 100) / 100} -`);
  //   mainWindow.webContents.send('cpu', v * 100);
  //   mainWindow.webContents.send('mem', os.freemem());
  //   mainWindow.webContents.send('total-mem', os.totalmem());
  // });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('openDevTools', (event, args) => {
  // Do something with file contents
  isOpenDevTools(mainWindow.webContents);
  // Send result back to renderer process
});
