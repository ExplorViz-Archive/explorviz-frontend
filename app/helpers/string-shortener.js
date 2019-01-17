import { helper } from '@ember/component/helper';

export function shortenString(params) {
  const [value, desiredLength] = params;
  return String(value).substring(0, desiredLength) + "...";
}

export default helper(shortenString);