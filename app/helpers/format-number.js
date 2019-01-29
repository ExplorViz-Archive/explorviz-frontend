import { helper } from '@ember/component/helper';

export function formatNumber(params) {
  const [number] = params;
  return number.toLocaleString();
}

export default helper(formatNumber);
