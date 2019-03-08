import { helper } from '@ember/component/helper';

export function formatNumber(params) {
  const [number, unit] = params;
  if (unit === 's'){
    return (number / 1000).toString();
  } else {
    return number.toString();
  }
}

export default helper(formatNumber);
