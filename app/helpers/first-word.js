import { helper } from '@ember/component/helper';

export function firstWord(params) {
  const [string] = params;
  var words = string.split(" ");
  return words[0]
}

export default helper(firstWord);