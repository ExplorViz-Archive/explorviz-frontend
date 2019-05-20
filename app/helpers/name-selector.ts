import { helper } from '@ember/component/helper';

export function nameSelector([pid, name]:[number, string]) {
  if(name !== undefined && name !== "") {
    return name;
  } else {
    return pid;
  }
}

export default helper(nameSelector);