import path from 'path'

import electron from 'electron'
import settings from 'electron-settings';

const { app, BrowserWindow, ipcMain, dialog } = electron

let consoleWindow, presenterWindow, state

const saveState = (s) => {
  state = s
  settings.set('state', s)
}

const createWindow = (name) => {
  const thisWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(app.getAppPath(), 'web/assets/icons/electron-tracker.png'),
    webPreferences: {
      preload: path.resolve(app.getAppPath(), `${name}-preload.cjs`),
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
  if (presenterWindow) return
  presenterWindow = createWindow('presenter')
  presenterWindow.loadFile(path.resolve(app.getAppPath(), 'web/presenter.html'))
  presenterWindow.webContents.openDevTools()
  presenterWindow.on('close', () => presenterWindow = null)
}

const broadcastState = (_event, s, all) => {
  if (typeof all !== 'undefined') {
    consoleWindow.webContents.send('console:state', s)
  } else {
    saveState(s);
  }
  if(presenterWindow) {
    presenterWindow.webContents.send('presenter:state', s)
  }
}

const broadcastFiles = (files, all) => {
  consoleWindow.webContents.send('console:files', files)
}

app.on('ready', () => {
  createConsoleWindow()
  settings.get('state').then((s) => {
    state = s
    broadcastState(null, s, true)
  })
})

ipcMain.on('openFiles', () => {
  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections ']
  }).then((files) => {
    if (files.canceled) return
    broadcastFiles(files)
  })
})

ipcMain.on('openPresenter', createPresenterWindow)
ipcMain.on('setState', broadcastState)
ipcMain.handle('getState', () => state)

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
