import { helper } from '@ember/component/helper';
import Role from 'explorviz-frontend/models/role';
import DS from 'ember-data';

export function userRolesList([roles]:[DS.PromiseManyArray<Role>]) {

  let rawRoleList:Array<string> = [];

  for(let i = 0; i < roles.get('length'); i++) {
    let role:Role|undefined = roles.objectAt(i);
    if(role !== undefined) {
      rawRoleList.push(role.get('descriptor'));
    }
  }

  if(rawRoleList.length === 0) {
    return '{ }';
  }

  let rolesList = `{`;

  for(let i = 0; i < rawRoleList.length - 1; i++) {
    rolesList = `${rolesList}${rawRoleList[i]}, `;
  }

  rolesList = `${rolesList}${rawRoleList[rawRoleList.length - 1]}}`;

  return rolesList;
}

export default helper(userRolesList);
