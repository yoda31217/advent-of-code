import { countBy, every, values } from 'lodash';
import { initArray } from '../../utils/arrays';
import { splitByComa, splitLines } from '../../utils/strings';

export function calc(input: string) {
  let lines = splitLines(input);

  let result = 0;

  let modules = {};

  lines.forEach((line) => {
    let targets = splitByComa(line.split(' -> ')[1]);

    if (line.startsWith('broadcaster')) {
      modules['broadcaster'] = { name: 'broadcaster', type: 'broadcaster', targets: targets };
    } else if (line.startsWith('%')) {
      let name = line.split(' -> ')[0].substring(1);
      let type = line.split(' -> ')[0].charAt(0);
      modules[name] = { name: name, type: type, targets: targets, state: false };
    } else {
      let name = line.split(' -> ')[0].substring(1);
      let type = line.split(' -> ')[0].charAt(0);
      modules[name] = { name: name, type: type, targets: targets, state: {} };
    }
  });

  Object.values(modules).forEach((m) => {
    // console.log(m);
    // @ts-ignore
    m.targets.forEach((t) => {
      if (!modules[t]) {
        return;
      }

      let targetInputs = modules[t].inputs || [];
      modules[t].inputs = targetInputs;
      // @ts-ignore
      targetInputs.push(m.name);
      if (modules[t].type === '&') {
        // @ts-ignore
        modules[t].state[m.name] = false;
      }
    });
  });

  // let mlist = Object.values(modules);

  console.log(modules, Object.values(modules).length, countBy(values(modules), 'type'));

  let falses = 0;
  let trues = 0;

  let pulses = initArray(100_000, () => null);

  let cache = {};

  // !!!
  for (let btns = 1; btns <= 1 / 0; btns++) {
    let left = 0;
    let right = 1;
    pulses[0] = [false, 'button', modules['broadcaster'], 'broadcaster'];

    let iOut = 0;
    let iName = 'vd';

    while (left < right) {
      let [pv, fromModuleName, m, mn] = pulses[left];
      left++;

      // @ts-ignore
      if (every(values(modules[iName].state))) {
        if (iOut < 10) {
          iOut++;
          // @ts-ignore
          console.log(iName, values(modules[iName].state).map(Number).sort().join(''));
          console.log(btns);
        }
      }

      // let key = mn + '=' + pv;
      // if (cache[key] === undefined) {
      //   let cval = cache[key] || btns;
      //   // cval++;
      //   cache[key] = cval;
      // }

      // console.log(fromModuleName, pv, mn);

      // !!!
      // if (mn === 'output' && !pv) {
      // if (mn === 'rx' && !pv) {
      if (mn === 'rx' && !pv) {
        return btns;
      }

      // !!!
      if (pv) {
        trues++;
      } else {
        falses++;
      }

      if (!m) {
        continue;
      }

      if (m.type === 'broadcaster') {
        for (let ti = 0; ti < m.targets.length; ti++) {
          let t = m.targets[ti];
          pulses[right] = [pv, m.name, modules[t], t];
          right++;
        }
      } else if (m.type === '%') {
        if (!pv) {
          m.state = !m.state;
          for (let ti = 0; ti < m.targets.length; ti++) {
            let t = m.targets[ti];
            pulses[right] = [m.state, m.name, modules[t], t];
            right++;
          }
        }
      } else if (m.type === '&') {
        m.state[fromModuleName] = pv;
        let respuls = !every(values(m.state));
        for (let ti = 0; ti < m.targets.length; ti++) {
          let t = m.targets[ti];
          pulses[right] = [respuls, m.name, modules[t], t];
          right++;
        }
      }
    }

    if (btns % 1_000_000 === 0) {
      // @ts-ignore
      // console.log('bk', values(modules.bk.state).map(Number).sort().join(''));

      // @ts-ignore
      // sortBy(keys(cache)).forEach((k) => {
      //   // @ts-ignore
      //   console.log(k, cache[k]);
      // });

      // // @ts-ignore
      // sortBy(values(modules), (m) => {
      //   // @ts-ignore
      //   return m.name;
      // }).forEach((m) => {
      //   // @ts-ignore
      //   console.log(m.name, JSON.stringify(m.state));
      // });

      console.log('----', btns, new Date());
    }
  }

  return trues * falses;
}

/*
 * bin
 *

bk


40910
45001
49092
53183
---
4091

tp

98225
102154
106083
---
3929

pt

184322
188329
192336
----
4007


vd

50999
54922

---
3923


The only & in scheme:

&bk -(-)-> &ln -(+)-\
&tp -(-)-> &db -(+)--\
&pt -(-)-> &vq -(+)---\
&vd -(-)-> &tf -(+)-----> &tg -(-)-> rx


so, we need to calculate cycle length of bk(4091), tp(3929), pt(4007) and vd(3923). And mytliply them:

> 4091*3929*4007*3923
252667369442479

 *
 *
 *
 *
 * */
