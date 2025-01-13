import { RecipeState } from "./types"
import { createZustandStore } from "../utils/helper"
import { produce } from 'immer'

const initialState = {
  recipes: [],
}

export const useRecipestore = createZustandStore<RecipeState>("recipe")(() => initialState)

const set = useRecipestore.setState
class RecipeActions {

  async fetchRecipes() {
    const recipes = await window.electron.ipcRenderer.invoke('db:fetchRecipes')
    set(state => produce(state, draft => {
      draft.recipes = recipes
    }))
    return recipes
  }
}

export const recipeActions = new RecipeActions()
