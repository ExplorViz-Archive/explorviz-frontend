import Route from '@ember/routing/route';
// @ts-ignore
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { action } from '@ember/object';
import DS from 'ember-data';
import User from 'explorviz-frontend/models/user';
import Transition from '@ember/routing/-private/transition';

export default class UserManagementUsersRoute extends Route.extend(AuthenticatedRouteMixin) {
  queryParams = {
    page: {
      type: 'number',
      refreshModel: true
    },
    size: {
      type: 'number',
      refreshModel: true
    }
  }

  @action
  refreshRoute() {
    return this.refresh();
  }

  async model(params:any) {
    return this.store.query('user', {
      page: {
        number: params.page,
        size: params.size
      }
    });
  }

  afterModel(users: DS.RecordArray<User>, transition: Transition) {
    let page = parseInt(transition.to.queryParams['page'] as string);
    if(users.length === 0) {
      let lastPage = users.meta.pagination.last.number;
      if(page > lastPage) {
        // @ts-ignore
        this.transitionTo({ queryParams: { page: lastPage } });
      } else {
        this.refresh();
      }
    }
  }
}
