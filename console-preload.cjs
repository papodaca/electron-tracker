const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('consoleAPI', {
  openPresenter: () => ipcRenderer.send('openPresenter'),
  broadcastState: (state) => ipcRenderer.send('setState', state),
  getState: () => ipcRenderer.invoke('getState'),
  openFiles: () => ipcRenderer.invoke('openFiles'),
  subscribeToFiles: (callback) => ipcRenderer.on('console:files', (_e, files) => callback(files))
})
