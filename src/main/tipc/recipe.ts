import { t } from './_instance';

export const recipeRouter = {
  getRecipeIcon: t.procedure.input<string>().action(async ({ input }) => {
    return "icon" + input;
  }),
}
