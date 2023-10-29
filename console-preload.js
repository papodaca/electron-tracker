const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('consoleAPI', {
  openPresenter: () => ipcRenderer.send('openPresenter'),
  broadcastState: (state) => ipcRenderer.send('setState', state)
})
