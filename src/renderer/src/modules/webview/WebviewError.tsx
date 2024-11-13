import { FC } from "react";

export const WebViewError: FC = () => {
  return <div className="w-full h-full flex justify-center items-center">
    <div className="text-red-500">
      Webview error, click <button className="text-blue-500">here</button> to reload
    </div>
  </div>
}
