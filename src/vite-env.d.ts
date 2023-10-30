/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Files {
  canceled: boolean,
  filePaths: string[],
  bookmarks: string[]
}
interface ConsoleIPC {
  openPresenter: () => void
  broadcastState: (state: any) => void
  subscribeToFiles: (StateSubscriber) => void
  subscribeToState: (StateSubscriber) => void
  getState: () => Promise<any>
  openFiles: () => Promise<Files>
}
declare const consoleAPI: ConsoleIPC

type StateSubscriber = (state: any) => void
interface presenterIPC {
  subscribeToStateChange: (StateSubscriber) => void,
  getState: () => Promise<any>
}
declare const presenterAPI: presenterIPC
