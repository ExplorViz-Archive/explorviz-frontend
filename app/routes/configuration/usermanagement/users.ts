import { action } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import DS from 'ember-data';
import User from 'explorviz-frontend/models/user';
import BaseRoute from 'explorviz-frontend/routes/base-route';

export default class UserManagementUsersRoute extends BaseRoute {
  queryParams = {
    page: {
      refreshModel: true,
      type: 'number',
    },
    size: {
      refreshModel: true,
      type: 'number',
    },
  };

  @action
  refreshRoute() {
    return this.refresh();
  }

  async model(params: any) {
    return this.store.query('user', {
      page: {
        number: params.page,
        size: params.size,
      },
    });
  }

  afterModel(users: DS.RecordArray<User>, transition: Transition) {
    const page = parseInt(transition.to.queryParams.page as string, 10);
    if (users.length === 0) {
      const lastPage = users.meta.pagination.last.number;
      if (page > lastPage) {
        // @ts-ignore
        this.transitionTo({ queryParams: { page: lastPage } });
      } else {
        this.refresh();
      }
    }
  }
}
