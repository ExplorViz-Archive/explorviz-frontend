import { helper } from '@ember/component/helper';

export function stringshortener(params) {
  const [value, desiredLength] = params;
  if (String(value).length <= desiredLength) {
    return String(value);
  } else {
    return String(value).substring(0, desiredLength) + "...";
  }
}

export default helper(stringshortener);