import { FC } from 'react';
import { PinIcon, ArrowRightIcon, MoreHorizontalIcon, PinOff } from 'lucide-react';
export const Sidebar: FC = () => {
  const { ipcRenderer } = window.electron;

  return <div className="w-8 h-full text-white flex flex-col bg-gray-800">
    <div className="flex flex-col gap-3 items-center w-full h-full py-2">
      <ArrowRightIcon className="w-4 h-4" onClick={() => {
        ipcRenderer.send('hide-window');
      }} />
      <PinIcon className="w-4 h-4" onClick={() => {
        ipcRenderer.send('pin-window');
      }} />
      <PinOff className="w-4 h-4" onClick={() => {
        ipcRenderer.send('unpin-window');
      }} /> 
      <MoreHorizontalIcon className="w-4 h-4" />
    </div>
  </div>;
};
