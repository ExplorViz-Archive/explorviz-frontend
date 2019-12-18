import BaseRoute from 'explorviz-frontend/routes/base-route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from '@ember/object';

export default class UserManagementUsersRoute extends BaseRoute.extend(AuthenticatedRouteMixin) {
  queryParams = {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    }
  }

  @action
  refreshRoute() {
    return this.refresh();
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
