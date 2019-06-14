import DS from 'ember-data';
import Role from './role';
import User from './user';

const { attr, hasMany } = DS;

export default class Userbatchrequest extends DS.Model {

	@attr('string') prefix!: string;

	@attr('number') count!: number;

	@attr() passwords!: string[];

	@attr() roles!: Role[];

	@attr() preferences!: Object;

	@hasMany('user') users!: DS.PromiseManyArray<User>;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'userbatchrequest': Userbatchrequest;
  }
}
