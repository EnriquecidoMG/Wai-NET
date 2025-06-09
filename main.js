const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

let mainWindow;

function createWindow() {
  // Define ruta del icono según plataforma
  let iconPath = null;

  if (process.platform === 'win32') {
    iconPath = path.join(__dirname, 'assets', 'icon.ico');    // Windows usa .ico
  } else if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, 'assets', 'icon.icns');   // macOS usa .icns
  } else {
    iconPath = path.join(__dirname, 'assets', 'icon.png');    // Linux usa .png
  }

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    autoHideMenuBar: true,
    resizable: false,  // ← Esto fija el tamaño de la ventana, no deja redimensionar
    icon: iconPath,   // Aquí asignamos el icono
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

ipcMain.handle('check-password', async (_, password) => {
  const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.substring(0, 5);
  const suffix = sha1.substring(5);

  try {
    const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
    const lines = response.data.split(/\r?\n/);
    const found = lines.some(line => line.split(':')[0] === suffix);
    return { found };
  } catch (error) {
    throw new Error('Error al verificar la contraseña');
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
