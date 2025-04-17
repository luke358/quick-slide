import { recipeActions } from "@renderer/store/recipe/store"
import { useQuery } from "@tanstack/react-query"

export const recipesQuery = {
  getRecipes: {
    queryKey: ['recipes'],
    queryFn: () => recipeActions.fetchRecipes(),
    meta: {
      persist: true
    }
  }
}

export const useRecipes = () => {
  return useQuery(recipesQuery.getRecipes)
}
