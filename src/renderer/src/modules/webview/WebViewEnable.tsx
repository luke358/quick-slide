import { servicesQuery } from "@renderer/queries/services";
import { IService } from "@shared/types";
import { Power } from "lucide-react";
import { FC, memo } from "react";

export const WebViewEnable: FC<{ service: IService }> = memo(({ service }) => {
  const updateServiceSettingMutation = servicesQuery.updateSettings()
  return <div className="w-full h-full flex justify-center items-center">
    <Power size={30} className="text-white/50 cursor-pointer" onClick={() => {
      updateServiceSettingMutation.mutate({
        service,
        key: 'enabled',
        value: true,
      })
    }} />
  </div>
})
