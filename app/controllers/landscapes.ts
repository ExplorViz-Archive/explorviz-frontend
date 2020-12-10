import Controller from '@ember/controller';
import { action } from '@ember/object';
import LandscapeTokenService, { LandscapeToken } from 'explorviz-frontend/services/landscape-token';
import { inject as service } from '@ember/service';

export default class Landscapes extends Controller {
  @service('landscape-token')
  tokenService!: LandscapeTokenService;

  tokens: LandscapeToken[] = [
    {
      id: 'wll4TQ3TM0WybrliNBKg', alias: 'Landscape 1', creationDate: '23.07.2020', lastUpdated: '12.08.2020 - 11:30:20',
    },
    {
      id: 'mD9u7lA3GtDw0FmP30Yq', alias: 'Landscape 2', creationDate: '28.07.2020', lastUpdated: '12.08.2020 - 11:35:10',
    },
    {
      id: 'qOZJ7IZzNXL3rpZflyQs', alias: 'Landscape 3', creationDate: '11.08.2020', lastUpdated: '12.08.2020 - 11:20:45',
    },
    {
      id: 'pFeHmxzfzHSq5iiFPyYe', alias: undefined, creationDate: '12.08.2020', lastUpdated: '12.08.2020 - 11:50:45',
    },
    {
      id: 'pFeHmxzfzHSq5iiFPyYe', alias: undefined, creationDate: '12.08.2020', lastUpdated: '12.08.2020 - 11:50:45',
    },
    {
      id: 'pFeHmxzfzHSq5iiFPyYe', alias: undefined, creationDate: '12.08.2020', lastUpdated: '12.08.2020 - 11:50:45',
    },
    {
      id: 'pFeHmxzfzHSq5iiFPyYe', alias: undefined, creationDate: '12.08.2020', lastUpdated: '12.08.2020 - 11:50:45',
    },
    {
      id: 'pFeHmxzfzHSq5iiFPyYe', alias: undefined, creationDate: '12.08.2020', lastUpdated: '12.08.2020 - 11:50:45',
    },
    {
      id: 'pFeHmxzfzHSq5iiFPyYe', alias: undefined, creationDate: '12.08.2020', lastUpdated: '12.08.2020 - 11:50:45',
    },
    {
      id: 'pFeHmxzfzHSq5iiFPyYe', alias: undefined, creationDate: '12.08.2020', lastUpdated: '12.08.2020 - 11:50:45',
    },
    {
      id: 'pFeHmxzfzHSq5iiFPyYe', alias: undefined, creationDate: '12.08.2020', lastUpdated: '12.08.2020 - 11:50:45',
    },
  ];

  @action
  selectToken(token: LandscapeToken) {
    this.tokenService.setToken(token);
    this.transitionToRoute('visualization');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'landscapes': Landscapes;
  }
}
