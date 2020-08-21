import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import LandscapeRepository from 'explorviz-frontend/services/repos/landscape-repository';
import THREE from 'three';

export default class VirtualReality extends Route.extend({
  // anything which *must* be merged to prototype here
}) {
  @service('repos/landscape-repository')
  landscapeRepo!: LandscapeRepository;

  model() {
    return new Promise((resolve, reject) => {
      new THREE.FontLoader().load(
        // resource URL
        '/three.js/fonts/roboto_mono_bold_typeface.json',

        // onLoad callback
        (font) => {
          resolve(font);
          this.debug('(THREE.js) font sucessfully loaded.');
        },
        undefined,
        (e) => {
          reject(e);
          this.debug('(THREE.js) font failed to load.');
        },
      );
    });
  }
}
