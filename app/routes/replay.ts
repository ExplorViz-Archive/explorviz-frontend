import Route from '@ember/routing/route';
import Service, { inject as service } from '@ember/service';
import LandscapeFileLoader from 'explorviz-frontend/services/landscape-file-loader';

export default class Replay extends Route {

  @service('landscape-file-loader') landscapeFileLoader !: any;

  activate() {
    console.log('route replay entered on loading.');
    
    const id:string = "history-124d55fa-5560-426a-9f06-9f77966f9116-1";
    const timestamp:number = 1565348832597;
    const totalRequests:number = 42;

    this.get('landscapeFileLoader').downloadLandscape(id, timestamp, totalRequests);
  }

  resetRoute() {

  }
  // // @Override BaseRoute
  // actions: {
  //   //resetRoute() {
  //   //}
  // }
}
