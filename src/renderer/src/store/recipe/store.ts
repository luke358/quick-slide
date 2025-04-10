import { createZustandStore } from "../utils/helper"
import { produce } from 'immer'
import { tipcClient } from "@renderer/lib/client"
import { RecipeState } from '@shared/types'
const initialState = {
  recipes: [],
}

export const useRecipeStore = createZustandStore<RecipeState>("recipe")(() => initialState)

const set = useRecipeStore.setState
class RecipeActions {

  async fetchRecipes() {
    const recipes = await tipcClient?.getRecipes()
    set(state => produce(state, draft => {
      draft.recipes = recipes || []
    }))
    return recipes
  }
}

export const recipeActions = new RecipeActions()
