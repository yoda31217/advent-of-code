import { writeFileSync } from 'fs';
import { countBy, difference, isEqual, keys, uniqWith, values } from 'lodash';
import { splitLines, splitSpaced } from '../../utils/strings';

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

  // console.log('comps', components);
  console.log('comps', keys(components).length);

  let ucons = values(components)
    // .filter((comp: any) => comp.connections.length > 6)
    .map((comp: any) => comp.connections.map((conn) => [comp.name, conn].sort()))
    .flat(1);
  ucons = uniqWith(ucons, isEqual);

  // console.log('uconns', ucons);
  console.log('uconns', ucons.length);

  // keys(components).forEach((c) => console.log(c));
  // ucons.forEach(([l, r]) => console.log(l + ' ' + r));
  // return 0;

  console.log('counts', countBy(values(components).map((c: any) => c.connections.length)));

  // values(components)
  //   .filter((c: any) => c.connections.length >= 8)
  //   .forEach((c) => console.log(c));

  let result = 0;

  let q = 0;
  let startMillis = 0;

  let firstComp = keys(components)[0];
  let compsCount = keys(components).length;

  for (let i = 0; i < ucons.length; i++) {
    let conn1 = ucons[i];
    for (let j = i + 1; j < ucons.length; j++) {
      let conn2 = ucons[j];

      // conn1 = ['hfx', 'pzl'].sort();
      // conn2 = ['nvd', 'jqt'].sort();
      // conn1 = ['bvb', 'cmg'].sort();

      // for (let k = j + 1; k < ucons.length; k++) {
      //   const conn3 = ucons[k];

      // console.log('start');

      q++;

      if (q % 1000 === 0) {
        const nowDate = new Date();
        let finishMillis = nowDate.getTime();
        console.log(i, j, q, 'duration:', finishMillis - startMillis, nowDate);
        startMillis = finishMillis;
      }

      // for (let i = 0; i < keys(components).length; i++) {
      //   const startComp = keys(components)[i];
      //
      //   console.log('Test start!!!!', startComp);

      let seen = {};

      fill(conn1[0], seen, components, conn1, conn2, 1, new Map());
      // fill(startComp, seen, components, conn1, conn2, specCache);
      // }
      //
      // return 0;

      // console.log('seen', keys(seen).length);
    }
  }

  return result;
}

function isConnEqual(conn: [string, string], comp0: string, comp1: string): boolean {
  return (conn[0] === comp0 && conn[1] === comp1) || (conn[0] === comp1 && conn[1] === comp0);
}

function fill(
  curr: string,
  seen: { [key: string]: boolean },
  components: { [key: string]: any },
  conn1: [string, string],
  conn2: [string, string],
  version: number,
  connected: Map<string, number>,
) {
  version++;

  let baseVersion = version;

  let leftConnectionsCount = 0;

  if (seen[curr]) {
    return [version, leftConnectionsCount];
  }

  // console.log('curr', curr);
  seen[curr] = true;

  for (let i = 0; i < components[curr].connections.length; i++) {
    const connName = components[curr].connections[i];

    if (!seen[connName] && !isConnEqual(conn1, curr, connName) && !isConnEqual(conn2, curr, connName)) {
      let res = fill(connName, seen, components, conn1, conn2, version, connected);
      version = res[0];
      leftConnectionsCount += res[1];
    }
  }

  // console.log('after curr', curr);

  connected.set(curr, baseVersion);

  let validConnections = components[curr].connections.filter((connName) => {
    return !isConnEqual(conn1, curr, connName) && !isConnEqual(conn2, curr, connName);
  });
  validConnections.forEach((vc) => {
    let conVersion = connected.get(vc);
    if (conVersion !== undefined && conVersion >= baseVersion) {
      leftConnectionsCount--;
    } else {
      leftConnectionsCount++;
    }
  });

  //////////////////////

  if (leftConnectionsCount === 1) {
    let connectedKeys = [];
    connected.forEach((v, k) => {
      if (v !== undefined && v >= baseVersion) {
        connectedKeys.push(k);
      }
    });

    let allConnections = connectedKeys
      .map((cc) =>
        components[cc].connections.filter((ccc) => {
          return !isConnEqual(conn1, cc, ccc) && !isConnEqual(conn2, cc, ccc);
        }),
      )
      .flat(1);

    let connectedCount = connectedKeys.length;
    let leftConns = difference(allConnections, connectedKeys);

    // console.log('lcc', leftConnectionsCount);
    printResult(
      '11111',
      curr,
      '-',
      leftConns,
      conn1,
      conn2,
      'res:',
      connectedCount,
      keys(components).length - connectedCount,
      (keys(components).length - connectedCount) * connectedCount,
      'validity:',
      leftConnectionsCount,
      leftConns.length,
      connectedKeys,
      difference(keys(components), connectedKeys),
    );
  }

  return [version, leftConnectionsCount];
}

function printResult(...argz) {
  console.log(...argz);
  writeFileSync(`res-${new Date().toLocaleString()}.txt`.replace(/\//g, '-'), JSON.stringify(argz, null, '  '), {
    encoding: 'utf-8',
  });
}
