import { useQuery } from "@tanstack/react-query"
import { useRecipestore, recipeActions } from "./store"

export const useRecipes = () => {

  const { isLoading, isError } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => recipeActions.fetchRecipes(),
  })

  return {
    isLoading,
    isError,
    recipes: useRecipestore(state => state.recipes)
  }
}

