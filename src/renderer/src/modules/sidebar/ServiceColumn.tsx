import { PopoverProps } from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import VerticalSwitch from "@renderer/components/ui/vertical-switch";
import { HotKeyScopeMap } from "@renderer/constants/hotkeys";
import { cn, getOS } from "@renderer/lib/utils";
import { useActiveServiceId, useServicesData } from "@renderer/store/services/hooks";
import { serviceActions } from "@renderer/store/services/store";
import { IService } from "@renderer/store/services/types";
import { ArrowLeft, ArrowRight, Globe, Home, Link2Icon, MoreVertical, NotebookIcon, PlusCircle, RefreshCcw, Trash2, Volume1 } from "lucide-react";
import { FC, memo, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
interface ServiceComponentProps extends PopoverProps {
  service: IService
  isActive?: boolean
  onActivate?: (id: string) => void;
  open: boolean;
  shortcut: string
  setOpen: (open: boolean) => void;
}

const ServiceIcon = ({ iconUrl, className }: { iconUrl?: string | null, className?: string }) => {
  return iconUrl ? <img src={iconUrl} className={cn('w-5', className)} /> : <Globe className={cn("w-5", className)} />
}

const ServiceComponent = memo(({ service, shortcut, children, isActive, onActivate, open, setOpen, ...props }: PropsWithChildren<ServiceComponentProps>) => {
  const finalShortcut = getOS() === "Windows" ? shortcut?.replace("meta", "ctrl").replace("Meta", "Ctrl") : shortcut

  const webview = service.webview

  useHotkeys(finalShortcut, (e) => {
    e.preventDefault()
    onActivate?.(service.serviceId)
  }, { scopes: HotKeyScopeMap.Home })

  return <Popover modal open={open} onOpenChange={setOpen} {...props}>
    <PopoverTrigger
      asChild onClick={(e) => {
        e.preventDefault()
        if (isActive) {
          setOpen(!open)
        } else {
          onActivate?.(service.serviceId)
        }
      }}
      onContextMenu={(e) => {
        e.stopPropagation()
        setOpen(true)
      }}>
      <div className='relative w-full h-10 flex items-center justify-center'>
        {isActive && <div className='absolute left-0 w-[3px] h-8 top-1 bg-gray-400 rounded-r-md'></div>}
        {children}
      </div>
    </PopoverTrigger>
    <PopoverContent
      onEscapeKeyDown={(e) => e.stopPropagation()}
      side="right" align="start" alignOffset={5} className="backdrop-blur-3xl bg-black/40 shadow-md outline-none border-none text-white pt-3 pb-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <div className="flex gap-1">
            <ServiceIcon iconUrl={service.iconUrl} className="h-8 w-auto" />
            <div>
              <div className="text-sm">{service.name}</div>
              <div className="text-xs">{/* X. It's what's happening TODO: show title */}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <VerticalSwitch
              checked={service.enabled}
              onCheckedChange={(checked) => {
                serviceActions.updateService(service, 'enabled', checked)
              }}
            />
            <div><Volume1 size={14} className={cn({ 'text-blue-600': !service.isMuted })}
              onClick={() => {
                serviceActions.toggleMute(service.serviceId)
              }} /></div>
            <div onClick={() => {
              serviceActions.removeService(service.serviceId)
            }}>
              <Trash2 size={14} />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <Home size={14} onClick={() => {
            webview?.loadURL?.(service.serviceUrl)
          }} />
          <ArrowLeft size={14} onClick={() => {
            webview?.goBack?.()
          }} className={cn({ 'cursor-not-allowed': !webview?.canGoBack })} />
          <ArrowRight size={14} onClick={() => {
            webview?.goForward?.()
          }} className={cn({ 'cursor-not-allowed': !webview?.canGoForward })} />
          <RefreshCcw size={14} onClick={() => {
            serviceActions.updateRuntimeState(service, 'isLoading', true)
            webview?.reload?.()
          }} />
          <Link2Icon size={14} onClick={() => {
            window.open(webview?.getURL(), '_blank')
          }} />
          <NotebookIcon size={14} />
          <MoreVertical size={14} />
        </div>
      </div>
    </PopoverContent>
  </Popover >
})

export const ServiceColumn: FC = memo(() => {
  const [openPopover, setOpenPopover] = useState<string | null>(null)
  const services = useServicesData()
  const id = useActiveServiceId()

  useEffect(() => {
    const handleHiding = () => {
      setOpenPopover(null)
    }
    const offWindowHiding = window.api.onWindowHiding(handleHiding)
    // const offWindowBlur = window.api.onWindowBlur(handleHiding)
    window.addEventListener('blur', handleHiding)
    return () => {
      offWindowHiding()
      window.removeEventListener('blur', handleHiding)
    }
  }, [])

  const setOpen = useCallback((name: string, open: boolean) => {
    setOpenPopover(open ? name : null)
  }, [openPopover])

  const onActivate = (serviceId: string) => {
    setOpenPopover(null)
    serviceActions.setActive(serviceId)
  }

  return <div className='flex-1 flex flex-col justify-between pt-2 w-full select-none h-full overflow-hidden'>
    <div className="overflow-auto no-scrollbar">
      {
        services?.map((service, index) => <ServiceComponent
          key={service.serviceId}
          service={service}
          shortcut={`${index + 1}`}
          isActive={id === service.serviceId}
          onActivate={onActivate}
          open={openPopover === service.serviceId}
          setOpen={(open) => setOpen(service.serviceId, open)}
        >
          <ServiceIcon iconUrl={service.iconUrl} />
        </ServiceComponent>)
      }
    </div>
    <div className='relative w-full h-10 flex items-center justify-center mb-4'>
      {!id && <div className='absolute left-0 w-[3px] h-8 top-1 bg-gray-400 rounded-r-md'></div>}
      <PlusCircle className='w-4 h-10'
        onClick={() => {
          serviceActions.setActive(null)
        }} />
    </div>

  </div>
})

