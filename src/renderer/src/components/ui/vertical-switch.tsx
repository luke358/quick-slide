
import { cn } from "@renderer/lib/utils"
import * as React from "react"

interface VerticalSwitchProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export default function VerticalSwitch({
  checked = false,
  onCheckedChange,
  className,
  ...props
}: VerticalSwitchProps) {
  const [isChecked, setIsChecked] = React.useState(checked)

  const handleToggle = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    onCheckedChange?.(newChecked)
  }

  return (
    <button
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      className={cn(
        "relative outline-none focus:outline-none flex h-[20px] w-[10px] flex-col items-center rounded p-[2px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "bg-green-500" : "bg-red-500",
        className
      )}
      {...props}
    >
      {/* <span className="sr-only">{isChecked ? 'On' : 'Off'}</span> */}
      <span
        className={cn(
          "block h-[8px] w-[8px] rounded-[3px] bg-white shadow-lg ring-0 transition-transform duration-200",
          isChecked ? "translate-y-[7.5px]" : "translate-y-0"
        )}
      />
    </button>
  )
}
