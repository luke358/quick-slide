import { serviceActions } from '@renderer/store/services/store';
import { ElectronWebView } from '@renderer/store/services/types';
import { FC, useEffect, useRef } from 'react';
import { IService } from '@renderer/store/services/types';
import { DidNavigateEvent, DidNavigateInPageEvent } from 'electron';
import { uselastServiceUrls } from '@renderer/store/services/hooks';

interface WebviewProps {
  service: IService
}
export const Webview: FC<WebviewProps> = ({ service }) => {
  const webViewRef = useRef<ElectronWebView | null>(null)
  const lastServiceUrls = uselastServiceUrls()
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
    service.webview?.setAudioMuted(service.isMuted)
  }
  const didAttach = async () => {
    serviceActions.updateRuntimeState(service, 'webview', webViewRef.current)
    // webViewRef.current?.openDevTools()
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

  const didNavigateInPage = (event: DidNavigateInPageEvent | DidNavigateEvent) => {
    const normalizeUrl = (url: string) => url.replace(/\/$/, '');

    const eventUrl = event.url ? normalizeUrl(event.url) : '';
    const serviceUrl = normalizeUrl(service.serviceUrl);

    if (eventUrl && serviceUrl !== eventUrl) {
      serviceActions.updatelastServiceUrls(service, eventUrl)
    } else {
      serviceActions.updatelastServiceUrls(service)
    }
  }

  useEffect(() => {
    webViewRef?.current?.addEventListener('dom-ready', didFinishLoad)
    webViewRef.current?.addEventListener('did-attach', didAttach)
    webViewRef.current?.addEventListener('did-fail-load', didFailLoad)
    webViewRef.current?.addEventListener('media-started-playing', mediaStartedPlaying)
    webViewRef.current?.addEventListener('media-paused', mediaPaused)
    webViewRef.current?.addEventListener('did-navigate-in-page', didNavigateInPage)
    webViewRef.current?.addEventListener('did-navigate', didNavigateInPage)
    return () => {
      webViewRef?.current?.removeEventListener('dom-ready', didFinishLoad)
      webViewRef.current?.removeEventListener('did-attach', didAttach)
      webViewRef.current?.removeEventListener('did-fail-load', didFailLoad)
      webViewRef.current?.removeEventListener('media-started-playing', mediaStartedPlaying)
      webViewRef.current?.removeEventListener('media-paused', mediaPaused)
      webViewRef.current?.removeEventListener('did-navigate-in-page', didNavigateInPage)
      webViewRef.current?.removeEventListener('did-navigate', didNavigateInPage)
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
    className='w-full h-full' src={lastServiceUrls[service.serviceId] || service.serviceUrl}
  />
}
