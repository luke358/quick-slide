import { FC } from 'react';
import { Webview } from './Webview';
import { IService } from '@renderer/store/services/types';
import { cn } from '@renderer/lib/utils';

interface ServiceViewProps extends React.HTMLAttributes<HTMLDivElement> {
  service: IService
}
export const ServiceView: FC<ServiceViewProps> = ({ service, className, style }) => {
  return <div className={cn('webview-container w-full h-full', className)} style={style}>
    <Webview url={service.serviceUrl} />
  </div>
}
