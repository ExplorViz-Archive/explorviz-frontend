import DS from 'ember-data';
const { attr } = DS;


export default class Role extends DS.Model.extend({

  descriptor: attr('string')

}) {}
