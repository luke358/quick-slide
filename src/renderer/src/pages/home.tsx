import { ServiceView } from "@renderer/components/ServiceView";
import { Sidebar } from "@renderer/modules/sidebar";

export default function Home() {
  return <div className="flex flex-row h-full">
    <Sidebar />
    <div className="flex-1">
      <ServiceView />
    </div>
  </div>
}
