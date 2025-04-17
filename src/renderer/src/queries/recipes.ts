import { recipeActions } from "@renderer/store/recipe/store"
import { useQuery } from "@tanstack/react-query"

export const recipesQuery = {
  recipes: () => {
    return useQuery({
      queryKey: ['recipes'],
      queryFn: () => recipeActions.fetchRecipes(),
    })
  }
}
