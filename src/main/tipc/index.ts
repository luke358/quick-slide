import { recipeRoute } from './recipe';
import { serviceRoute } from './service';
import { menuRoute } from './menu';
import { appRoute } from './app';
import { settingsRoute } from './settings'
// import { t } from './_instance';

export const router = {
  ...recipeRoute,
  ...serviceRoute,
  ...menuRoute,
  ...appRoute,
  ...settingsRoute,
}
export type Router = typeof router;
