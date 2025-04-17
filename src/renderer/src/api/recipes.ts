import { Recipes } from "@prisma/client"
import { ofetch } from "ofetch"

export const recipeApi = {
  async fetchRecipes(): Promise<Recipes[]> {
    const response = await ofetch('https://quick-slide-recipes.vercel.app/recipes/recipes.json')
    return response
  }
}
