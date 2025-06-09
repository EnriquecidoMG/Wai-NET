const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  checkPassword: (password) => ipcRenderer.invoke('check-password', password),
  scanUrl: (url) => ipcRenderer.invoke('scan-url', url),
  whoisLookup: (domain) => ipcRenderer.invoke('whois-lookup', domain),
  sha1Hash: (text) => ipcRenderer.invoke('sha1-hash', text)
});

