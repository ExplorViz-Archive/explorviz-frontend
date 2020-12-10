import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { LandscapeToken } from 'explorviz-frontend/services/landscape-token';
import { action } from '@ember/object';

interface Args {
  tokens: LandscapeToken[];
  selectToken(token: LandscapeToken): void;
}

export default class TokenSelection extends Component<Args> {
  @tracked
  sortProperty: keyof LandscapeToken = 'alias';

  @tracked
  sortOrder: 'asc'|'desc' = 'asc';

  @action
  sortBy(property: keyof LandscapeToken) {
    if (property === this.sortProperty) {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else {
        this.sortOrder = 'asc';
      }
    } else {
      this.sortOrder = 'asc';
      this.sortProperty = property;
    }
  }
}
