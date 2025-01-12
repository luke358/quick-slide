import { serviceActions } from '@renderer/store/services/store';
import { ElectronWebView } from '@renderer/store/services/types';
import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { IService } from '@renderer/store/services/types';
import { DidFailLoadEvent, DidNavigateEvent, DidNavigateInPageEvent } from 'electron';
import { uselastServiceUrls } from '@renderer/store/services/hooks';

const normalizeUrl = (url: string) => url.replace(/\/$/, '');

interface WebviewProps {
  service: IService
}
export const Webview: FC<WebviewProps> = memo(({ service }) => {
  const webViewRef = useRef<ElectronWebView | null>(null)
  const lastServiceUrls = uselastServiceUrls()

  const didStartLoading = () => {
    console.log('didStartLoading triggered:', service.name); // 添加调试日志
    serviceActions.updateRuntimeState(service, 'isLoading', true)
  }
  const didStopLoading = () => {
    serviceActions.updateRuntimeState(service, 'isLoading', false)
  }
  const didFinishLoad = () => {
    console.log('didFinishLoad triggered:', service.name); // 添加调试日志
    // if (!service.iconUrl) {
    //   webViewRef.current?.executeJavaScript(`
    //     let iconLink = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
    //   iconLink ? iconLink.href : '${webViewRef.current?.src}/favicon.ico';
    // `).then(async iconUrl => {
    //     const cachedIcon = await window.electron.ipcRenderer.invoke('download-icon', { serviceName: service.name, iconUrl })
    //     if (cachedIcon) {
    //       serviceActions.updateService(service, 'iconUrl', cachedIcon)
    //     }
    //   }).catch(error => {
    //     console.error('获取 favicon 出错:', error);
    //   });
    // }
    serviceActions.updateRuntimeState(service, 'isLoading', false)
  }
  const domReady = useCallback(() => {
    console.log('domReady triggered:', service.name); // 添加调试日志
    service.webview?.setAudioMuted(service.isMuted)
  }, [service.name])
  const didAttach = async () => {
    // console.log('didAttach triggered:', service.name); // 添加调试日志
    serviceActions.updateRuntimeState(service, 'webview', webViewRef.current)
    // webViewRef.current?.openDevTools()

    // 只在首次加载时检查 lastServiceUrl
    const serviceUrl = normalizeUrl(service.serviceUrl);
    if (lastServiceUrls[service.serviceId]) {
      const lastServiceUrl = normalizeUrl(lastServiceUrls[service.serviceId] || service.serviceUrl);
      console.log(lastServiceUrl, serviceUrl, 'lastServiceUrl !== serviceUrl')
      if (lastServiceUrl !== serviceUrl) {
        webViewRef.current?.loadURL(lastServiceUrl)
      }
    }
  }
  const didFailLoad = (event: DidFailLoadEvent) => {
    console.log('didFailLoad triggered:', event); // 添加调试日志
    if (!event.isMainFrame) return
    if (
      event.errorCode !== -21 &&
      event.errorCode !== -3
    ) {
      serviceActions.updateRuntimeState(service, 'isLoading', false)
    }
  }
  const mediaStartedPlaying = () => {
    serviceActions.updateRuntimeState(service, 'isMediaPlaying', true)
  }
  const mediaPaused = () => {
    serviceActions.updateRuntimeState(service, 'isMediaPlaying', false)
  }

  const didNavigate = (event: DidNavigateInPageEvent | DidNavigateEvent) => {
    console.log('didNavigateInPage triggered:', event); // 添加调试日志
    serviceActions.updateRuntimeState(service, 'isLoading', false)


    const eventUrl = event.url ? normalizeUrl(event.url) : '';
    const serviceUrl = normalizeUrl(service.serviceUrl);

    if (eventUrl && serviceUrl !== eventUrl) {
      serviceActions.updatelastServiceUrls(service, eventUrl)
    } else {
      serviceActions.updatelastServiceUrls(service)
    }
  }
  const didNavigateInPage = (event: DidNavigateInPageEvent | DidNavigateEvent) => {
    const eventUrl = event.url ? normalizeUrl(event.url) : '';
    const serviceUrl = normalizeUrl(service.serviceUrl);

    console.log('didNavigateInPage triggered:', event); // 添加调试日志
    if (eventUrl && serviceUrl !== eventUrl) {
      serviceActions.updatelastServiceUrls(service, eventUrl)
    } else {
      serviceActions.updatelastServiceUrls(service)
    }
  }

  useEffect(() => {
    webViewRef.current?.addEventListener('dom-ready', domReady)
    webViewRef.current?.addEventListener('did-start-loading', didStartLoading)
    webViewRef.current?.addEventListener('did-stop-loading', didStopLoading)
    webViewRef.current?.addEventListener('did-frame-finish-load', didFinishLoad)
    webViewRef.current?.addEventListener('did-navigate', didNavigate)

    webViewRef.current?.addEventListener('did-attach', didAttach)
    webViewRef.current?.addEventListener('did-fail-load', didFailLoad)
    webViewRef.current?.addEventListener('did-navigate-in-page', didNavigateInPage)

    webViewRef.current?.addEventListener('media-started-playing', mediaStartedPlaying)
    webViewRef.current?.addEventListener('media-paused', mediaPaused)
    return () => {
      webViewRef?.current?.removeEventListener('dom-ready', domReady)
      webViewRef?.current?.removeEventListener('did-start-loading', didStartLoading)
      webViewRef?.current?.removeEventListener('did-stop-loading', didStopLoading)
      webViewRef.current?.removeEventListener('did-frame-finish-load', didFinishLoad)
      webViewRef.current?.removeEventListener('did-navigate', didNavigate)

      webViewRef.current?.removeEventListener('did-attach', didAttach)
      webViewRef.current?.removeEventListener('did-fail-load', didFailLoad)
      webViewRef.current?.removeEventListener('did-navigate-in-page', didNavigateInPage)

      webViewRef.current?.removeEventListener('media-started-playing', mediaStartedPlaying)
      webViewRef.current?.removeEventListener('media-paused', mediaPaused)
    }
  }, [domReady])

  return <webview
    // allowpopups
    // @ts-ignore
    allowpopups="true"
    // @ts-ignore
    nodeintegration="true"
    webpreferences={`
      spellcheck=${service.shareWithWebview.spellcheckerLanguage ? 1 : 0},
      contextIsolation=1,
      webSecurity=1,
      allowRunningInsecureContent=false,
      enableRemoteModule=false
    `}
    ref={(_webviewRef: ElectronWebView) => {
      webViewRef.current = _webviewRef
    }}
    useragent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
    className='w-full h-full'
    src={service.serviceUrl}
  />
})
