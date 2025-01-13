import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('QuickSlide', {
  sendKey: (key: string) => ipcRenderer.send('webview-keydown', key)
})

const hasFocusedElement = () => {
  return document.activeElement && document.activeElement !== document.body;
};

window.addEventListener('keydown', (event) => {
  if (hasFocusedElement()) return
  if (event.key === 'Escape') {
    ipcRenderer.send('set-showing', false)
  } else if (event.key === 'p' && event.metaKey) {
    ipcRenderer.send('set-pin')
  } else {
    ipcRenderer.sendToHost('webview-keydown', event.key)
  }
})
