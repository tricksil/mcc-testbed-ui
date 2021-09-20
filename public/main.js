/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      sandbox: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.resolve(__dirname, 'preload.js'),
      webSecurity: false,
    },
    simpleFullscreen: true,
    icon: `${__dirname}/logo.png`,
  });

  const loadUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true,
      });
  mainWindow.loadURL(loadUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.maximize();
  mainWindow.removeMenu();
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
