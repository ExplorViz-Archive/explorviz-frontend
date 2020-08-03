import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';

export default class VirtualReality extends Route.extend({
  // anything which *must* be merged to prototype here
}) {
  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;
  // normal class body definition here
}
