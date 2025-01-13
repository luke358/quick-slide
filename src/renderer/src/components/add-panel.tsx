import { PlusIcon, X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useRecipes } from "@renderer/store/recipe/hooks";
import { tipcClient } from "@renderer/lib/client";
import RecipeIcon from "./RecipeIcon";
import { queryClient } from "@renderer/lib/query-client";
import { serviceActions } from "@renderer/store/services/store";

export default function AddPanel() {
  const { isLoading, isError, recipes } = useRecipes()
  // useEffect(() => {
  //   tipcClient?.getRecipeIcon('123').then((res) => {
  //     console.log(res)
  //   })
  // }, [])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>
  return (
    <div className="absolute bottom-0 left-0 w-full h-full flex flex-col items-center bg-transparent">
      <div className="flex flex-col h-full w-[80%]">
        {/* <div className="w-full h-[40px] mt-[10%]">
          <Input icon={<Chrome />} style={{}} className="rounded-full bg-[#ababab] placeholder:text-[#444444] outline-none border-none" placeholder="Enter Keyword or a URL" />
        </div> */}
        <div className="text-white text-lg mt-[40px]">Favourites</div>
        <ScrollArea className="w-full flex-1 overflow-auto my-[10px] relative">
          {/* 你的 Favourites 列表 */}

          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="group bg-gray-400 w-[85px] h-[85px] p-[8px] rounded-2xl flex justify-between flex-col overflow-hidden relative">
                <RecipeIcon icon={recipe.icon!} name={recipe.name} onClick={async () => {
                  const service = await tipcClient?.addService(recipe)
                  await queryClient.invalidateQueries({ queryKey: ['services'] })
                  service && serviceActions.setActive(service.serviceId)
                }} />
                <div className="text-black text-xs text-wrap break-words">{recipe.name}</div>
                {!recipe.isPreset && <X className="absolute text-gray-500 top-[8px] right-[8px] opacity-0 group-hover:opacity-100 transition-opacity" size={18} onClick={() => {
                  console.log('remove')
                }} />}
              </div>
            ))}
            <div className="bg-gray-500 w-[85px] h-[85px] p-[8px] rounded-2xl flex justify-center items-center overflow-hidden">
              <PlusIcon size={40} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
