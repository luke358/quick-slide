import { serviceActions } from '@renderer/store/services/store';
import { ElectronWebView } from '@renderer/store/services/types';
import { FC, useEffect, useRef } from 'react';
import { IService } from '@renderer/store/services/types';


interface WebviewProps {
  service: IService
}
export const Webview: FC<WebviewProps> = ({ service }) => {
  const webViewRef = useRef<ElectronWebView | null>(null)

  const didFinishLoad = () => {
    if (!service.iconUrl) {
      webViewRef.current?.executeJavaScript(`
        let iconLink = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
      iconLink ? iconLink.href : '${webViewRef.current?.src}/favicon.ico';
    `).then(async iconUrl => {
        const cachedIcon = await window.electron.ipcRenderer.invoke('download-icon', { serviceName: service.name, iconUrl })
        if (cachedIcon) {
          serviceActions.updateService(service, 'iconUrl', cachedIcon)
        }
      }).catch(error => {
        console.error('获取 favicon 出错:', error);
      });
    }
    serviceActions.updateRuntimeState(service, 'isLoading', false)
  }
  const didAttach = () => {
    serviceActions.updateRuntimeState(service, 'webview', webViewRef.current)

  }
  const didFailLoad = () => {
    serviceActions.updateRuntimeState(service, 'isLoading', false)
  }
  const mediaStartedPlaying = () => {
    serviceActions.updateRuntimeState(service, 'isMediaPlaying', true)
  }
  const mediaPaused = () => {
    serviceActions.updateRuntimeState(service, 'isMediaPlaying', false)
  }
  useEffect(() => {
    webViewRef?.current?.addEventListener('did-finish-load', didFinishLoad)
    webViewRef.current?.addEventListener('did-attach', didAttach)
    webViewRef.current?.addEventListener('did-fail-load', didFailLoad)
    webViewRef.current?.addEventListener('media-started-playing', mediaStartedPlaying)
    webViewRef.current?.addEventListener('media-paused', mediaPaused)
    return () => {
      webViewRef?.current?.removeEventListener('did-finish-load', didFinishLoad)
      webViewRef.current?.removeEventListener('did-attach', didAttach)
      webViewRef.current?.removeEventListener('did-fail-load', didFailLoad)
    }
  }, [])
  return <webview
    // @ts-ignore
    allowpopups="true"
    // @ts-ignore
    nodeintegration="true"
    webpreferences={`spellcheck=${service.shareWithWebview.spellcheckerLanguage ? 1 : 0
      }, contextIsolation=1`}
    ref={(_webviewRef: ElectronWebView) => {
      webViewRef.current = _webviewRef
    }}
    className='w-full h-full' src={service.serviceUrl}
  />
}
