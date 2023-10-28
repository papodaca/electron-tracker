const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(app.getAppPath(), 'web/assets/icons/electron-tracker.png'),
    webPreferences: {
      preload: path.resolve(app.getAppPath(), 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile(path.resolve(app.getAppPath(), 'web/index.html'))
  mainWindow.webContents.openDevTools()
}

app.on('ready', () => {
  createWindow()

  ipcMain.on('openFiles', () => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections ']
    }).then((files) => {
      if (files.canceled) return
      console.log(files)
    })
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
