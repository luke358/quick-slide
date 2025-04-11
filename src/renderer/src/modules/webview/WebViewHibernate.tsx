import { serviceActions } from "@renderer/store/services/store";
import { IService } from "@shared/types";
import { FC } from "react";

export const WebViewHibernate: FC<{ service: IService }> = ({ service }) => {
  return <div className="w-full h-full flex justify-center items-center text-white">
    Webview hibernating, click <button className="text-blue-500" onClick={() => {
      serviceActions.awake({ serviceId: service.serviceId })
    }}>Wake Up</button> to wake up
  </div>
}
