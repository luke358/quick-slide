import { Kbd } from "@renderer/components/ui/kbd";
import { shortcuts } from "@renderer/constants/shortcuts";
import { Fragment } from "react/jsx-runtime";

export default function Shortcuts() {
  const shortcutList = [
    {
      description: "Switch to the next app",
      shortcut: shortcuts.home.nextApp.key
    },
    {
      description: "Switch to the previous app",
      shortcut: shortcuts.home.prevApp.key
    },
    {
      description: "Switch to a specific app",
      shortcut: "Meta+1-9"
    },
    {
      description: "Close current app",
      shortcut: "Meta+Shift+W"
    },
    {
      description: "Open a new app",
      shortcut: shortcuts.home.gotoNew.key
    },
    {
      description: "Reload current app",
      shortcut: shortcuts.home.reloadApp.key
    },
    {
      description: "Zoom in",
      shortcut: "Meta++"
    },
    {
      description: "Zoom out",
      shortcut: "Meta+-"
    },
    {
      description: "Reset zoom",
      shortcut: "Meta+0"
    },
  ]

  return (
    <div className="backdrop-blur-3xl bg-gray-800/80 rounded-md p-8 shadow-md outline-none border-none text-white">
      <div className="grid grid-cols-[3fr_1fr] gap-1">
        {shortcutList.map(({ description, shortcut }) => (
          <Fragment key={shortcut}>
            <div>{description}</div>
            <div><Kbd>{shortcut}</Kbd></div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
