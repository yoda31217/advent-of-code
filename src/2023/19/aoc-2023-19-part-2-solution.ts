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

  let intervals = [
    {
      wname: 'in',
      x: [1, 4000],
      m: [1, 4000],
      a: [1, 4000],
      s: [1, 4000],
    },
  ];

  while (intervals.length) {
    let interval = intervals.pop();

    console.log(interval);

    if (interval.wname === 'A') {
      console.log('Accepted!!!');
      res +=
        (interval.x[1] - interval.x[0] + 1) *
        (interval.m[1] - interval.m[0] + 1) *
        (interval.a[1] - interval.a[0] + 1) *
        (interval.s[1] - interval.s[0] + 1);
      continue;
    } else if (interval.wname === 'R') {
      console.log('Rejected!!!');
      continue;
    }

    let w = workflows[interval.wname];

    for (let i = 0; i < w.rules.length; i++) {
      const wrule = w.rules[i];
      console.log('rule', wrule);
      let ivals = interval[wrule.cat];

      if (wrule.sign === '<') {
        if (ivals[0] >= wrule.val) {
          console.log('NOT INCL');
          continue;
        } else if (ivals[1] < wrule.val) {
          console.log('FULL INCP');
          intervals.push({
            ...interval,
            wname: wrule.dest,
          });
          break;
        } else {
          console.log('PART INCP');
          intervals.push({
            ...interval,
            wname: wrule.dest,
            [wrule.cat]: [ivals[0], wrule.val - 1],
          });
          ivals = [wrule.val, ivals[1]];
          interval[wrule.cat] = ivals;
        }
      } else {
        if (ivals[1] <= wrule.val) {
          console.log('NOT INCL');
          continue;
        } else if (ivals[0] > wrule.val) {
          console.log('FULL INCP');
          intervals.push({
            ...interval,
            wname: wrule.dest,
          });
          break;
        } else {
          console.log('PART INCP');
          intervals.push({
            ...interval,
            wname: wrule.dest,
            [wrule.cat]: [wrule.val + 1, ivals[1]],
          });
          ivals = [ivals[0], wrule.val];
          interval[wrule.cat] = ivals;
        }
      }
    }
  }

  return res;

  // 167409079868000
  // 256000000000000
}
