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
