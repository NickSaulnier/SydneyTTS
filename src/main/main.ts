import { app, BrowserWindow, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

let flaskProcess: ChildProcess | null = null;

function getServerDir(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'server');
  }
  return path.join(app.getAppPath(), 'server');
}

function startFlask(): void {
  const serverDir = getServerDir();
  const isWin = process.platform === 'win32';
  const python = isWin ? 'python' : 'python3';
  const scriptPath = path.join(serverDir, 'app.py');

  flaskProcess = spawn(python, [scriptPath], {
    cwd: serverDir,
    stdio: 'inherit',
  });

  flaskProcess.on('error', (err) => {
    console.error('Failed to start Flask:', err);
  });

  flaskProcess.on('exit', (code, signal) => {
    flaskProcess = null;
    if (code !== null && code !== 0) {
      console.error('Flask exited with code', code);
    }
  });
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

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }
}

ipcMain.handle(
  'save-audio-to-downloads',
  (_event, { data, filename }: { data: string; filename: string }) => {
    const downloadsDir = app.getPath('downloads');
    let safeName = path.basename(filename) || 'audio.wav';
    if (!safeName.toLowerCase().endsWith('.wav')) {
      safeName = `${safeName}.wav`;
    }
    const filePath = path.join(downloadsDir, safeName);
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filePath, buffer);
    return { success: true, path: filePath };
  }
);

app.whenReady().then(() => {
  startFlask();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (flaskProcess) {
    flaskProcess.kill();
    flaskProcess = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
