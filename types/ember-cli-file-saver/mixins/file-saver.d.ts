// @ts-ignore
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver';

declare module '@ember/mixins' {
  interface Registry {
    'FileSaverMixin': any;
  }
}
