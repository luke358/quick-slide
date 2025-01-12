import { tipcClient } from "@renderer/lib/client";
import { cn } from "@renderer/lib/utils";
import { HTMLAttributes, memo, useEffect, useState } from "react";

interface RecipeIconProps extends HTMLAttributes<HTMLDivElement> {
  icon: string;
  name: string;
  onClick?: () => void;
}

export default memo(function RecipeIcon({
  icon,
  name,
  onClick,
  className
}: RecipeIconProps) {
  const [iconData, setIconData] = useState<string | null>(null)
  useEffect(() => {
    // get icon from app
    tipcClient?.getRecipeIcon({ icon, recipeName: name }).then((res) => {
      setIconData(res)
    })
  }, [icon, name]);
  return <div onClick={onClick} className={cn('w-[40px] h-[40px] rounded-md overflow-hidden', className)}>
    {iconData && <img src={iconData} alt={name} className="w-full h-full object-cover" />}
  </div>;
})
