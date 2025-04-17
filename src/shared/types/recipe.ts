
export interface Recipes {
  name: string
  icon: string
  recipeId: string
  serviceUrl: string
  version: string
  category: string[]
}

export type RecipeState = {
  recipes: Recipes[]
}

export interface IRecipe extends Recipes {

}
