import React, { useEffect } from "react";

interface RecipeIconProps {
  icon: string;
  name: string;
  onClick: () => void;
}

export default function RecipeIcon({
  icon,
  name,
  onClick,
}: RecipeIconProps) {
  useEffect(() => {
    // get icon from app
    
  }, [icon, name]);
  return <div onClick={onClick}>{icon}</div>;
}
