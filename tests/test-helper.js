import { setApplication, setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import Application from '../app';
import config from '../config/environment';
import resolver from './helpers/resolver';

setResolver(resolver);
setApplication(Application.create(config.APP));

start();
