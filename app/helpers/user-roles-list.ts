import { helper } from '@ember/component/helper';

export function userRolesList([roles]:[string]) {

  let rawRoleList:Array<string> = [];

  for(let i = 0; i < roles.length; i++) {
    let role:string|undefined = roles[i];
    if(role !== undefined) {
      rawRoleList.push(role);
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
