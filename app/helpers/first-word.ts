import { helper } from '@ember/component/helper';

export function firstWord([string]:[string]) {

  let firstWord;
  if (string.includes(' ')) {
    let words = string.split(' ');
    firstWord = words[0];
  } else {
    firstWord = string;
  }

  return firstWord;
}

export default helper(firstWord);