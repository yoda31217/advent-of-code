import { every, values } from 'lodash';
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

  console.log(modules);

  let falses = 0;
  let trues = 0;


  for (let i = 0; i < 1000; i++) {
    let pulses = [[false, 'button', modules['broadcaster']]];

    while (pulses.length > 0) {
      let [pv, fromModuleName, m] = pulses.shift();

      if (pv) trues++;
      else falses++;

      if (!m) {
        continue;
      }

      console.log(fromModuleName, pv, m.name);

      if (m.type === 'broadcaster') {
        m.targets.forEach((t) => pulses.push([pv, m.name, modules[t]]));
      } else if (m.type === '%') {
        if (!pv) {
          m.state = !m.state;
          m.targets.forEach((t) => pulses.push([m.state, m.name, modules[t]]));
        }
      } else if (m.type === '&') {
        m.state[fromModuleName] = pv;
        let respuls = !every(values(m.state));
        m.targets.forEach((t) => pulses.push([respuls, m.name, modules[t]]));
      }
    }
  }

  return trues * falses;
}
