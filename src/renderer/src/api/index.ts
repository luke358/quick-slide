// import RecipesApi from './RecipesApi';
import ServicesApi from './ServicesApi';

export interface ApiInterface {
  services: ServicesApi;
  // recipePreviews: RecipePreviewsApi;
  // recipes: RecipesApi;
}

export default (server: any): ApiInterface => ({
  services: new ServicesApi(server),
  // recipePreviews: new RecipePreviewsApi(server),
  // recipes: new RecipesApi(server),
});
