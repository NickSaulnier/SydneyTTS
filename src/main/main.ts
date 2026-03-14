import { app, BrowserWindow } from 'electron';
import * as path from 'path';
const { execFile } = require('child_process');

let flaskProcess: { kill: () => void; };

function getBackendPath() {
  // Use a different path for development vs production
  return app.isPackaged 
    ? path.join(process.resourcesPath, 'backend', 'app.exe')
    : path.join(__dirname, 'dist', 'app.exe');
}

function startFlask() {
  const backendPath = getBackendPath();
  flaskProcess = execFile(backendPath);
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  startFlask();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      startFlask();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    if (flaskProcess) {
      flaskProcess.kill();
    }
  }
});
