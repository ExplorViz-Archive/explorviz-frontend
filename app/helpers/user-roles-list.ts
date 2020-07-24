import { helper } from '@ember/component/helper';

export function userRolesList([roles]: [string[]]) {
  const roleListString = roles.sort().join(', ');
  return `{ ${roleListString} }`;
}

export default helper(userRolesList);
