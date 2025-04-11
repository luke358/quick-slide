import { FC, memo, useCallback } from 'react';
import { Webview } from './Webview';
import { cn } from '@renderer/lib/utils';
import { WebViewEnable } from './WebViewEnable';
import { WebViewHibernate } from './WebViewHibernate';
import { WebviewLoad } from './WebviewLoad';
import { WebViewError } from './WebviewError';
import { IService } from '@shared/types';

interface ServiceViewProps extends React.HTMLAttributes<HTMLDivElement> {
  service: IService
}
export const ServiceView: FC<ServiceViewProps> = memo(({ service, className, style }) => {

  const renderWebview = useCallback(() => {
    if (!service.enabled) return <WebViewEnable service={service} />
    if (service.isHibernateEnabled && service.isHibernating) return <WebViewHibernate service={service} />
    if (service.isError) return <WebViewError />
    return <Webview service={service} />
  }, [service])
  return <div className={cn('webview-container w-full h-full relative', className)} style={style}>
    {renderWebview()}
    {service.isLoading && <WebviewLoad />}
  </div>
})
