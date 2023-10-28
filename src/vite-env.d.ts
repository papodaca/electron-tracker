/// <reference types="svelte" />
/// <reference types="vite/client" />

interface IPC {
  openFiles: () => void,
  read
}
declare const electronAPI: IPC
