
import { Recipes } from "@prisma/client"

export type RecipeState = {
  recipes: Recipes[]
}

export interface IRecipe extends Recipes {
}
