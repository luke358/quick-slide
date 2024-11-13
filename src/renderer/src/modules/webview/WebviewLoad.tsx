import { Loader2 } from "lucide-react";
import { FC } from "react";

export const WebviewLoad: FC = () => {
  return <div className="w-full h-full flex absolute top-0 left-0 justify-center items-center backdrop-blur-2xl">
    <Loader2 className="animate-spin text-white" />
  </div>
}
