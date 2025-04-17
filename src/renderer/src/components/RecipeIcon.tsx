import { tipcClient } from "@renderer/lib/client";
import { cn } from "@renderer/lib/utils";
import { Recipes } from "@shared/types";
import { HTMLAttributes, memo, useEffect, useState } from "react";

interface RecipeIconProps extends HTMLAttributes<HTMLDivElement> {
  recipe: Recipes
  onClick?: () => void;
}

export default memo(function RecipeIcon({
  recipe,
  onClick,
  className
}: RecipeIconProps) {
  const [iconData, setIconData] = useState<string | null>(null)
  useEffect(() => {
    // get icon from app
    tipcClient?.getRecipeIcon({ icon: recipe.icon, recipeName: recipe.name }).then((res) => {
      setIconData(res)
    })
  }, [recipe]);
  return <div onClick={onClick} className={cn('w-[40px] h-[40px] rounded-md overflow-hidden', className)}>
    {iconData && <img src={iconData} alt={recipe.name} className="w-full h-full object-cover" />}
  </div>;
})
