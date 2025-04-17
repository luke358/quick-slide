import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('QuickSlide', {
  sendKey: (key: string) => ipcRenderer.send('webview-keydown', key)
})

const hasFocusedElement = () => {
  return document.activeElement && document.activeElement !== document.body;
};

window.addEventListener('keydown', (e) => {
  if (hasFocusedElement()) return
  ipcRenderer.sendToHost('webview-keydown', {
    key: e.key,
    code: e.code,
    keyCode: e.keyCode,
    which: e.which,
    location: e.location,
    repeat: e.repeat,
    isComposing: e.isComposing,
    metaKey: e.metaKey,
    ctrlKey: e.ctrlKey,
    altKey: e.altKey,
    shiftKey: e.shiftKey,
    bubbles: true,
    cancelable: true,
    composed: true,
    type: e.type,
    timeStamp: e.timeStamp
  })
})

class RecipeController {
  ipcEvents = {
    'initialize-recipe': 'loadRecipeModule',
    'find-in-page': 'openFindInPage',
  }
  // // recipe: RecipeWebview | null = null;

  constructor() {
    this.initialize();
  }

  async initialize() {
    for (const channel of Object.keys(this.ipcEvents)) {
      ipcRenderer.on(channel, (...args) => {
        this[this.ipcEvents[channel]](...args);
      });
    }
    setTimeout(() => {
      ipcRenderer.sendToHost('hello')
    }, 100);
  }
}

console.log('new RecipeController();')
new RecipeController();
