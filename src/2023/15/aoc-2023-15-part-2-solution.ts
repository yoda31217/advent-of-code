import { find, remove, sum } from 'lodash';
import { initArray } from '../../utils/arrays';
import { splitByComa } from '../../utils/strings';

function hash(str: string) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = ((result + str.charCodeAt(i)) * 17) % 256;
  }
  return result;
}

export function calc(input: string) {
  let lines = splitByComa(input);

  const boxes: { label: string; focalLength: number }[][] = initArray(256, () => []);

  lines.forEach((line) => {
    if (line.endsWith('-')) {
      let label = line.substring(0, line.length - 1);
      let labelHash = hash(label);
      let box = boxes[labelHash];
      remove(box, (lens) => lens.label === label);
    } else {
      let label = line.split('=')[0];
      let lineHash = hash(label);
      let box = boxes[lineHash];
      let newFocalLength = Number(line.split('=')[1]);
      let lens = find(box, (lens) => lens.label === label);
      if (lens) {
        lens.focalLength = newFocalLength;
      } else {
        box.push({ label, focalLength: newFocalLength });
      }
    }
  });

  return sum(
    boxes.map((box, boxIndex) => {
      let boxResult = sum(box.map((lens, lensIndex) => lens.focalLength * (lensIndex + 1)));
      return (boxIndex + 1) * boxResult;
    }),
  );
}
