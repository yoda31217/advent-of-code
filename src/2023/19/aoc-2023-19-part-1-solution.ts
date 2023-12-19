import { sum, values } from 'lodash';
import { splitBlocks } from '../../utils/strings';

export function calc(input: string) {
  let blocks = splitBlocks(input);

  let workflows = {};

  blocks[0].map((line) => {
    let wname = line.split('{')[0];
    let rightpart = line.split('{')[1].split('}')[0];
    let rules = rightpart.split(',').map((rstr) => {
      if (!rstr.includes(':')) {
        return {
          cat: 'x',
          sign: '<',
          val: 1 / 0,
          dest: rstr,
        };
      } else {
        return rstr.includes('>')
          ? {
              cat: rstr.split('>')[0],
              sign: '>',
              val: Number(rstr.split('>')[1].split(':')[0]),
              dest: rstr.split(':')[1],
            }
          : {
              cat: rstr.split('<')[0],
              sign: '<',
              val: Number(rstr.split('<')[1].split(':')[0]),
              dest: rstr.split(':')[1],
            };
      }
    });
    console.log(line, wname, rules);

    return (workflows[wname] = { name: wname, rules: rules });
  });

  console.log(workflows);

  let res = 0;

  blocks[1].forEach((line) => {
    let lineparts = line.split('{')[1].split('}')[0].split(',');
    let part = {};
    lineparts.forEach((s) => (part[s.split('=')[0]] = Number(s.split('=')[1])));
    console.log(line, part);

    let wname = 'in';

    while (true) {
      console.log(wname);
      let w = workflows[wname];
      for (let i = 0; i < w.rules.length; i++) {
        const wrule = w.rules[i];

        let isOk = false;
        if (wrule.sign === '>') {
          isOk = part[wrule.cat] > wrule.val;
        } else {
          isOk = part[wrule.cat] < wrule.val;
        }

        console.log(wrule, isOk);

        if (isOk) {
          if (wrule.dest === 'R') {
            return;
          } else if (wrule.dest === 'A') {
            res += sum(values(part));
            return;
          } else {
            wname = wrule.dest;
            break;
          }
        }
      }
    }
  });

  return res;
}
