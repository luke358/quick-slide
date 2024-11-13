import { PopoverProps } from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { ArrowLeft, ArrowRight, Delete, EarIcon, Home, Link2Icon, MoreVertical, NotebookIcon, RefreshCcw, Twitter, Youtube } from "lucide-react";
import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
interface ServiceComponentProps extends PopoverProps {
  service: {
    icon: React.ReactNode;
    name: string;
  }
  isActive?: boolean
  onActivate?: () => void;
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
          onActivate?.()
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

export const ServiceColumn: FC = () => {

  const [active, setActive] = useState('Twitter')
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  useEffect(() => {
    const handleHiding = () => {
      setOpenPopover(null)
    }
    const offWindowHiding = window.api.onWindowHiding(handleHiding)
    const offWindowBlur = window.api.onWindowBlur(handleHiding)
    return () => {
      offWindowHiding()
      offWindowBlur()
    }
  }, [])

  const setOpen = useCallback((name: string, open: boolean) => {
    setOpenPopover(open ? name : null)
  }, [openPopover])

  return <div className='flex-1 flex flex-col items-center w-full pt-2'>
    <ServiceComponent
      isActive={active === 'Twitter'}
      onActivate={() => setActive('Twitter')}
      service={{ icon: <Twitter className='w-4 h-8' />, name: 'Twitter' }}
      open={openPopover === 'Twitter'}
      setOpen={(open) => setOpen('Twitter', open)}>
      <Twitter className='w-4 h-10' />
    </ServiceComponent>
    <ServiceComponent
      isActive={active === 'Baidu'}
      onActivate={() => setActive('Baidu')}
      service={{ icon: <Twitter className='w-4 h-8' />, name: 'Baidu' }}
      open={openPopover === 'Baidu'}
      setOpen={(open) => setOpen('Baidu', open)}>
      <Twitter className='w-4 h-10' />
    </ServiceComponent>
    <ServiceComponent
      isActive={active === 'Youtube'}
      onActivate={() => setActive('Youtube')}
      service={{ icon: <Youtube className='w-4 h-8' />, name: 'Youtube' }}
      open={openPopover === 'Youtube'}
      setOpen={(open) => setOpen('Youtube', open)}>
      <Youtube className='w-4 h-10' />
    </ServiceComponent>
  </div>
}
