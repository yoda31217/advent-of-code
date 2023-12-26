import { writeFileSync } from 'fs';
import { countBy, isEqual, keys, uniq, uniqWith, values } from 'lodash';
import { splitLines, splitSpaced } from '../../utils/strings';

function findTriangle(components: string[], sompMap: { [key: string]: any }): string[] {
  console.log('ttttttt', components);
  for (let i = 0; i < components.length; i++) {
    const cname = components[i];
    for (let j = i + 1; j < sompMap[cname].connections.length; j++) {
      const otherCname = sompMap[cname].connections[j];
      // console.log(cname, otherCname);
      for (let k = j + 1; k < sompMap[otherCname].connections.length; k++) {
        const ooCname = sompMap[otherCname].connections[k];
        if (ooCname !== cname && sompMap[ooCname].connections.includes(cname)) {
          console.log('triangle', cname, otherCname, ooCname);
          return [cname, otherCname, ooCname];
        }
      }
    }
  }
  return null;
}

export function calc(input: string) {
  let lines = splitLines(input);

  let components = {};

  lines.forEach((l) => {
    let cname = l.split(': ')[0];
    let connections = splitSpaced(l.split(': ')[1]);

    let c = components[cname] || {
      name: cname,
      connections: [],
    };

    c.connections.push(...connections);
    components[cname] = c;

    connections.forEach((connection) => {
      let c = components[connection] || {
        name: connection,
        connections: [],
      };

      c.connections.push(cname);
      components[connection] = c;
    });
  });

  console.log('comps', components);
  console.log('comps', keys(components).length);

  let ucons = values(components)
    // .filter((comp: any) => comp.connections.length > 6)
    .map((comp: any) => comp.connections.map((conn) => [comp.name, conn].sort()))
    .flat(1);
  ucons = uniqWith(ucons, isEqual);

  console.log('uconns', ucons);
  console.log('uconns', ucons.length);

  // keys(components).forEach((c) => console.log(c));
  // ucons.forEach(([l, r]) => console.log(l + ' ' + r));
  // return 0;

  console.log('counts', countBy(values(components).map((c: any) => c.connections.length)));

  console.log('====================');

  values(components)
    .filter((c: any) => c.connections.length >= 7)
    .forEach((c) => console.log(c));

  let ns = ['cds'];
  let cons = [];

  for (let i = 0; i < 4; i++) {
    cons.push(...ns.map((n) => components[n].connections.map((c) => [n, c])).flat(1));
    console.log(ns, cons);
    ns = uniq(ns.map((n) => components[n].connections).flat(1));
  }

  cons.forEach((c: string[]) => c.sort());
  cons = uniqWith(cons, isEqual);

  console.log(ns, cons);

  writeFileSync(`h.txt`, cons.map((c) => c.join(' ')).join('\n'), { encoding: 'utf-8' });

  return 'test';
}
