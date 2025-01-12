import { Recipes } from "@prisma/client";

export interface IRecipe extends Recipes {
}
// export interface IRecipe {
//   id: string;
//   name: string;
//   description: string;
//   version: string;
//   aliases: string[];
//   serviceURL: string;
//   hasDirectMessages: boolean;
//   hasIndirectMessages: boolean;
//   hasNotificationSound: boolean;
//   hasTeamId: boolean;
//   hasCustomUrl: boolean;
//   hasHostedOption: boolean;
//   urlInputPrefix: string;
//   urlInputSuffix: string;
//   message: string;
//   allowFavoritesDelineationInUnreadCount: boolean;
//   disablewebsecurity: boolean;
//   path: string;
//   partition: string;
//   local: boolean;
//   defaultIcon: string;

//   readonly overrideUserAgent?: () => string;

//   readonly buildUrl?: (url: string) => string;

//   readonly modifyRequestHeaders?: () => void;

//   readonly knownCertificateHosts?: () => void;

//   readonly events?: null | ((key: string) => string);

//   // TODO: [TS DEBT] Need to check if below properties are needed and where is inherited / implemented from
//   author?: string[];
//   hasDarkMode?: boolean;
//   validateUrl?: (url: string) => boolean;
//   icons?: any;
// }

export interface RecipeState {
  recipes: IRecipe[];
  installedRecipes: IRecipe[];
  isLoading: boolean;
  error: Error | null;
}
