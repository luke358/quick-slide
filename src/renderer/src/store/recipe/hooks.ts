import { useQuery } from "@tanstack/react-query"
import { useRecipeStore, recipeActions } from "./store"

export const useRecipes = () => {

  const { isLoading, isError } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => recipeActions.fetchRecipes(),
  })

  return {
    isLoading,
    isError,
    recipes: useRecipeStore(state => state.recipes)
  }
}

