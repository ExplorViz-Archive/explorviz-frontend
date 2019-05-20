import { helper } from '@ember/component/helper';

export function formatNumber([number, unit]:[number, string]) {
  if (unit === 's'){
    return (number / 1000).toString();
  } else {
    return number.toString();
  }
}

export default helper(formatNumber);
