import { helper } from '@ember/component/helper';

export function userRolesList(params) {

  if(params[0].length === 0) {
    return '';
  }

  let rolesList = `{`;

  for(let i = 0; i < params[0].length - 1; i++) {
    rolesList = `${rolesList}${params[0].objectAt(i).descriptor}, `;
  }

  rolesList = `${rolesList}${params[0].objectAt(params[0].length - 1).descriptor}}`;

  return rolesList;
}

export default helper(userRolesList);
