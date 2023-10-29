/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ConsoleIPC {
  openPresenter: () => void
  broadcastState: (state: any) => void
}
declare const consoleAPI: ConsoleIPC

type StateSubscriber = (state: any) => void
interface presenterIPC {
  subscribeToStateChange: (StateSubscriber) => void
}
declare const presenterAPI: presenterIPC
