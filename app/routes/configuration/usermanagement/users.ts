import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default class UserManagementUsersRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {
  queryParams = {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    }
  }

  model(params:any) {
    return this.store.query('user', {
      page: {
        number: params.page,
        size: params.size
      }
    });
  }
}
