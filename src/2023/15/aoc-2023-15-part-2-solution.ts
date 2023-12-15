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

  let boxes: [string, number][][] = new Array(256);
  for (let i = 0; i < 256; i++) {
    boxes[i] = [];
  }

  console.log(lines);

  lines.forEach((line, lineIndex) => {
    if (line.endsWith('-')) {
      let label = line.substring(0, line.length - 1);
      let lineHash = hash(label);
      let box = boxes[lineHash];
      for (let i = 0; i < box.length; i++) {
        if (box[i][0] === label) {
          box.splice(i, 1);
          return;
        }
      }
    } else {
      let label = line.split('=')[0];
      let lineHash = hash(label);
      let box = boxes[lineHash];
      let fl = Number(line.split('=')[1]);
      for (let i = 0; i < box.length; i++) {
        if (box[i][0] === label) {
          box.splice(i, 1, [label, fl]);
          return;
        }
      }
      box.push([label, fl]);
    }
  });

  // console.log('------', line);
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].length > 0) {
      console.log(i, boxes[i] + '');
    }
  }

  return boxes
    .map((box, bi) => {
      let s = box.map((s, si) => s[1] * (si + 1)).reduce(add, 0);

      return (bi + 1) * s;
    })
    .reduce(add, 0);
}
