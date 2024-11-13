import { ElectronWebView } from '@renderer/store/services/types';
import { FC, useEffect, useRef } from 'react';

interface WebviewProps {
  url: string
}
export const Webview: FC<WebviewProps> = ({ url }) => {
  const webViewRef = useRef<ElectronWebView | null>(null)
  useEffect(() => {


  })
  return <webview
    ref={(_webviewRef: ElectronWebView) => {
      webViewRef.current = _webviewRef
      // updateServiceWeview()
    }}
    className='w-full h-full' src={url} onError={(e) => {
      console.log('error', e);
    }}
    onLoadStart={() => {
      console.log('load start');
    }}
    onLoad={() => {
      console.log('loaded');
    }} />
}
