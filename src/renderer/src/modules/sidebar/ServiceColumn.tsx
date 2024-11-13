import { PopoverProps } from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { useActiveServiceId, useServicesData } from "@renderer/store/services/hooks";
import { serviceActions } from "@renderer/store/services/store";
import { IService } from "@renderer/store/services/types";
import { ArrowLeft, ArrowRight, Delete, EarIcon, Home, Link2Icon, MoreVertical, NotebookIcon, PlusCircle, RefreshCcw, Twitter, Youtube } from "lucide-react";
import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
interface ServiceComponentProps extends PopoverProps {
  service: IService
  isActive?: boolean
  onActivate?: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ServiceComponent = ({ service, children, isActive, onActivate, open, setOpen, ...props }: PropsWithChildren<ServiceComponentProps>) => {

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
      <div className='relative w-full flex items-center justify-center'>
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
            <div><Twitter /></div>
            <div>
              <div className="text-sm">{service.name}</div>
              <div className="text-xs">X. It's what's happening</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div><EarIcon size={14} /></div>
            <div><Delete size={14} /></div>
          </div>
        </div>
        <div className="flex justify-between items-center w-full">
          <Home size={14} />
          <ArrowLeft size={14} />
          <ArrowRight size={14} />
          <RefreshCcw size={14} />
          <Link2Icon size={14} />
          <NotebookIcon size={14} />
          <MoreVertical size={14} />
        </div>
      </div>
    </PopoverContent>
  </Popover >
}

const { ipcRenderer } = window.electron
export const ServiceColumn: FC = () => {
  const [openPopover, setOpenPopover] = useState<string | null>(null)
  const { services } = useServicesData()
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

  return <div className='flex-1 flex flex-col items-center w-full pt-2'>
    {
      services?.map((service) => <ServiceComponent
        key={service.serviceId}
        service={service}
        isActive={id === service.serviceId}
        onActivate={serviceActions.setActive}
        open={openPopover === service.serviceId}
        setOpen={(open) => setOpen(service.serviceId, open)}
      >
        <Youtube className='w-4 h-10' />
      </ServiceComponent>)
    }
    <PlusCircle className='w-4 h-10'
      onClick={() => {
        ipcRenderer.invoke('db:createService')
      }} />
  </div>
}
