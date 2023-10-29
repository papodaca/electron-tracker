const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('presenterAPI', {
  subscribeToStateChange: (callback) => ipcRenderer.on('presenter:state', (_e, s) => callback(s)),
  getState: () => ipcRenderer.invoke('getState'),
})
