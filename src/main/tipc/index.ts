import { recipeRoute } from './recipe';
import { serviceRoute } from './service';
import { menuRoute } from './menu';
import { appRoute } from './app';
import { settingsRoute } from './settings'
import { windowRoute } from './window';
// import { t } from './_instance';

export const router = {
  ...recipeRoute,
  ...serviceRoute,
  ...menuRoute,
  ...appRoute,
  ...settingsRoute,
  ...windowRoute,
}
export type Router = typeof router;
