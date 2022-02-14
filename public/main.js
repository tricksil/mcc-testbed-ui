/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const os = require('os-utils');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      sandbox: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.resolve(__dirname, 'preload.js'),
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
    simpleFullscreen: true,
    icon: `${__dirname}/logo.png`,
    title: 'MCC Testbed',
  });

  const loadUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true,
      });
  mainWindow.loadURL(loadUrl);
  mainWindow.webContents.session.clearStorageData();
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.maximize();
  mainWindow.removeMenu();
  setInterval(() => {
    os.cpuUsage((v) => {
      // app.
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      mainWindow.webContents.send('appMetrics', app.getAppMetrics());
      mainWindow.webContents.send('node', `${Math.round(used * 100) / 100} -`);
      mainWindow.webContents.send('cpu', v * 100);
      mainWindow.webContents.send('mem', os.freemem());
      mainWindow.webContents.send('total-mem', os.totalmem());
    });
  }, 1000);
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
