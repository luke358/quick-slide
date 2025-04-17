import { createZustandStore } from "../utils/helper"
import { produce } from 'immer'
import { RecipeState } from '@shared/types'
import { recipeApi } from "@renderer/api/recipes"
const initialState = {
  recipes: [],
}

export const useRecipeStore = createZustandStore<RecipeState>("recipe")(() => initialState)

const set = useRecipeStore.setState
class RecipeActions {

  async fetchRecipes() {
    const recipes = await recipeApi.fetchRecipes()
    set(state => produce(state, draft => {
      draft.recipes = recipes || []
    }))
    return recipes
  }
}

export const recipeActions = new RecipeActions()
