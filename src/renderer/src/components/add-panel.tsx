import { Chrome, PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export default function AddPanel() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-full flex flex-col items-center bg-transparent">
      <div className="flex flex-col h-full w-[80%]">
        <div className="w-full h-[40px] mt-[10%]">
          <Input icon={<Chrome />} style={{}} className="rounded-full bg-[#ababab] placeholder:text-[#444444] outline-none border-none" placeholder="Enter Keyword or a URL" />
        </div>
        <div className="text-white text-lg mt-[40px]">Favourites</div>
        <ScrollArea className="w-full flex-1 overflow-auto my-[10px] relative">
          {/* 你的 Favourites 列表 */}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4">
            {Array(20).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-400 w-[85px] h-[85px] p-[8px] rounded-2xl flex justify-between flex-col overflow-hidden">
                <div><Chrome /></div>
                <div className="text-black text-xs text-wrap break-words">Google Maps</div>
              </div>
            ))}
            <div className="bg-gray-400 w-[85px] h-[85px] p-[8px] rounded-2xl flex justify-center items-center overflow-hidden">
              <PlusIcon size={40}/>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
