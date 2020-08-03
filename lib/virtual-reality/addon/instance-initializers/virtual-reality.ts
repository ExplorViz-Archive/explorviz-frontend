import ApplicationInstance from '@ember/application/instance';
import Router from 'explorviz-frontend/router';
import PageSetup from 'explorviz-frontend/services/page-setup';

export function initialize(appInstance: ApplicationInstance): void {
  const service = appInstance.lookup('service:page-setup');

  if (service instanceof PageSetup) {
    service.navbarRoutes.push('virtual-reality');
  }

  // eslint-disable-next-line
  Router.map(function () {
    this.route('virtual-reality');
  });
}

export default {
  name: 'vr-rendering',
  initialize,
};
