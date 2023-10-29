const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

let consoleWindow, presenterWindow

const createWindow = (name) => {
  let thisWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(app.getAppPath(), 'web/assets/icons/electron-tracker.png'),
    webPreferences: {
      preload: path.resolve(app.getAppPath(), `${name}-preload.js`),
      nodeIntegration: true
    }
  })
  thisWindow.menuBarVisible = false
  return thisWindow
}

const createConsoleWindow = () => {
  consoleWindow = createWindow('console')
  consoleWindow.loadFile(path.resolve(app.getAppPath(), 'web/console.html'))
  consoleWindow.webContents.openDevTools()
}

const createPresenterWindow = () => {
  if(presenterWindow) return
  presenterWindow = createWindow('presenter')
  presenterWindow.loadFile(path.resolve(app.getAppPath(), 'web/presenter.html'))
  presenterWindow.webContents.openDevTools()
}

app.on('ready', () => {
  createConsoleWindow()
  // createPresenterWindow()

  ipcMain.on('openFiles', () => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections ']
    }).then((files) => {
      if (files.canceled) return
      console.log(files)
    })
  })

  ipcMain.on('openPresenter', createPresenterWindow)
  ipcMain.on('setState', (_event, state) => {
    presenterWindow.webContents.send('presenter:state', state)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (consoleWindow === null) {
    createConsoleWindow()
  }
})
