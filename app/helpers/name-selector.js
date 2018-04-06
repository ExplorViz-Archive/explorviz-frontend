import { helper } from '@ember/component/helper';

export function nameSelector(params/*, hash*/) {
  const [pid, name] = params;
  if(name !== undefined && name !== "") {    
    return name;
  } else {
    return pid;
  }
}

export default helper(nameSelector);