import { recipeRouter } from './recipe';
// import { t } from './_instance';

export const router = {
  ...recipeRouter,
}
export type Router = typeof router;
