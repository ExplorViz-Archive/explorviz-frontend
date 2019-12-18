import { helper } from '@ember/component/helper';

/**
 * Formats a number passed on the passed number and time unit
 * @param number passed number
 * @param unit time unit
 */
export function formatNumber([number, unit]: [number, string]) {

  if (unit === 'ms') {
    return (number / 1000000.0).toFixed(4).toString();
  }
  else if (unit === 's') {
    return (number / 1000000000.0).toFixed(4).toString();
  }
  else {
    // default time unit is `nanoseconds` (ns) as defined in backend
    return number.toFixed(2).toString();
  }
}

export default helper(formatNumber);
