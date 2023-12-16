import { add } from 'lodash';
import { splitByComa } from '../../utils/strings';

function hash(str: string) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = ((result + str.charCodeAt(i)) * 17) % 256;
  }
  return result;
}

export function calc(input: string) {
  return splitByComa(input).map(hash).reduce(add, 0);
}
