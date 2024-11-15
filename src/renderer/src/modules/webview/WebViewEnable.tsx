import { serviceActions } from "@renderer/store/services/store";
import { IService } from "@renderer/store/services/types";
import { Power } from "lucide-react";
import { FC } from "react";

export const WebViewEnable: FC<{ service: IService }> = ({ service }) => {
  return <div className="w-full h-full flex justify-center items-center">
    <Power size={30} className="text-white/50 cursor-pointer" onClick={() => {
      serviceActions.updateService(service, 'enabled', true)
    }} />
  </div>
}
