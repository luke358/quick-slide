import { FC } from 'react';
import { Webview } from './Webview';
import { IService } from '@renderer/store/services/types';
import { cn } from '@renderer/lib/utils';
import { WebViewEnable } from './WebViewEnable';
import { WebViewHibernate } from './WebViewHibernate';
import { WebviewLoad } from './WebviewLoad';
import { WebViewError } from './WebviewError';

interface ServiceViewProps extends React.HTMLAttributes<HTMLDivElement> {
  service: IService
}
export const ServiceView: FC<ServiceViewProps> = ({ service, className, style }) => {

  const renderWebview = () => {
    if (!service.enabled) return <WebViewEnable />
    if (service.isHibernateEnabled && service.isHibernating) return <WebViewHibernate service={service} />
    if (service.isError) return <WebViewError />
    return <Webview service={service} />
  }
  return <div className={cn('webview-container w-full h-full relative', className)} style={style}>
    {renderWebview()}
    {service.isLoading && <WebviewLoad />}
  </div>
}
