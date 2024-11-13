import { join } from "path";

export const asarPath = (dir: string = '') => {
  return dir.replace('app.asar', 'app.asar.unpacked');
};

export const asarRecipesPath = (...segments: string[]) => {
  return join(asarPath(join(__dirname, '..', 'recipes')), ...[segments].flat());
};
