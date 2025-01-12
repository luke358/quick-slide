import { recipeRouter } from './recipe';
import { serviceRouter } from './service';
// import { t } from './_instance';

export const router = {
  ...recipeRouter,
  ...serviceRouter
}
export type Router = typeof router;
