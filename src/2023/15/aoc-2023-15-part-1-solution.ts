import { add } from 'lodash';
import { splitByComa } from '../../utils/strings';

function hash(str: string) {
  let r = 0;
  for (let i = 0; i < str.length; i++) {
    r += str.charCodeAt(i);
    r *= 17;
    r = r % 256;
  }
  return r;
}

export function calc(input: string) {
  let lines = splitByComa(input);

  console.log(lines);

  return lines
    .map((line, lineIndex) => {
      console.log(line, hash(line));
      return hash(line);
    })
    .reduce(add, 0);
}
