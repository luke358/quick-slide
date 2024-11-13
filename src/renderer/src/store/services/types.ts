import { Prisma } from "@prisma/client";
import { IRecipe } from "../recipe/types";
export type ElectronWebView = Electron.WebviewTag

export interface IService extends Prisma.ServicesCreateInput {
  id: string;
  recipe: IRecipe;
  webview: ElectronWebView | null;
  timer: NodeJS.Timeout | null;
  lastPoll: number;
  isActive: boolean;
  isMediaPlaying: boolean;
  isHibernationEnabled: boolean;
  isHibernationRequested: boolean;
  shareWithWebview: {
    id: string;
    spellcheckerLanguage: string;
    isDarkModeEnabled: boolean;
  };
}

export interface ServiceState {
  services: IService[];
  activeServiceId: string | null;
  serviceUsed: Set<string>;
}
