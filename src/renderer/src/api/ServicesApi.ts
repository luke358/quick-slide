export default class ServicesApi {
  server: any;

  constructor(server: any) {
    this.server = server;
  }

  all() {
    return this.server.getServices();
  }

  create(recipeId: string, data: any) {
    return this.server.createService(recipeId, data);
  }

  // delete(serviceId: string) {
  //   return this.server.deleteService(serviceId);
  // }

  // update(serviceId: string, data: any) {
  //   return this.server.updateService(serviceId, data);
  // }

  // reorder(data: any) {
  //   return this.server.reorderService(data);
  // }
}
