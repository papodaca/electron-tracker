const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

let mainWindow

const createConsoleWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(app.getAppPath(), 'web/assets/icons/electron-tracker.png'),
    webPreferences: {
      preload: path.resolve(app.getAppPath(), 'console-preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile(path.resolve(app.getAppPath(), 'web/console.html'))
  mainWindow.webContents.openDevTools()
}

const createPresenterWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(app.getAppPath(), 'web/assets/icons/electron-tracker.png'),
    webPreferences: {
      preload: path.resolve(app.getAppPath(), 'presenter-preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile(path.resolve(app.getAppPath(), 'web/presenter.html'))
  mainWindow.webContents.openDevTools()
}

app.on('ready', () => {
  createConsoleWindow()
  createPresenterWindow()

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
    createConsoleWindow()
  }
})
