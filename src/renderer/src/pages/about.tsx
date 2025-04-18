
import icon from '@renderer/assets/electron.svg'
import { tipcClient } from '@renderer/lib/client'
import { useQuery } from '@tanstack/react-query'
export default function About() {
  const { data: appVersion } = useQuery({
    queryKey: ["appVersion"],
    queryFn: () => tipcClient?.getAppVersion() || "",
  })

  return (
    <div className="h-full w-full bg-gray-800 text-white flex flex-col items-center pb-2">
      <div className='flex items-center flex-col py-2 gap-1.5'>
        <img src={icon} alt="QuickSlide" className="w-16 h-16" />
        <div className='text-sm'>QuickSlide</div>
        <div className='text-[10px]'>Version {appVersion}</div>
      </div>
      <div className="flex-1 text-[10px] px-2 bg-gray-900 w-full whitespace-pre-wrap overflow-x-hidden break-words font-mono overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-800">
        开源软件声明
        {'\n'}
        __LICENSE__
      </div>
      <div className='text-[10px] pt-1'>Copyright @ 2025 QuickSlide. All rights reserved</div>
    </div >
  )
}
