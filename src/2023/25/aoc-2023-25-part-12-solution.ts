import { countBy, isEqual, keys, uniqWith, values } from 'lodash';
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

  let firstComp = keys(components)[0];
  let compsCount = keys(components).length;

  for (let i = 0; i < ucons.length; i++) {
    const conn1 = ucons[i];
    for (let j = i + 1; j < ucons.length; j++) {
      const conn2 = ucons[j];

      for (let k = j + 1; k < ucons.length; k += 1) {
        const conn3 = ucons[k];

        // let k = 0;
        q++;

        if (q % 1000 === 0) {
          console.log(i, j, k, q, new Date());
        }

        // const conn1 = ['hfx', 'pzl'].sort();
        // const conn2 = ['nvd', 'jqt'].sort();
        // const conn3 = ['bvb', 'cmg'].sort();

        // let compsLeft = keys(components);

        // let groups = [];

        // while (compsLeft.length > 0) {
        // console.log('comps left', compsLeft);
        // let newGroup = [];

        let stack = [conn1[0], conn2[0], conn3[0]];
        // let stack = [conn1[0]];
        let seen = {};
        let seenCount = 0;

        // console.log('start dij');
        //

        let conn2Count = 0;
        let conn3Count = 0;

        let stop = false;

        while (stack.length > 0) {
          let curr = stack.shift();

          if (seen[curr]) {
            continue;
          }

          if (curr === conn1[1] || curr === conn2[1] || curr === conn3[1]) {
            // if (curr === conn1[1]) {
            stop = true;
            break;
          }

          // if (curr === conn2[0] || curr === conn2[1]) {
          //   conn2Count++;
          //   if (conn2Count === 2) {
          //     stop = true;
          //     break;
          //   }
          // }
          //
          // if (curr === conn3[0] || curr === conn3[1]) {
          //   conn3Count++;
          //   if (conn3Count === 2) {
          //     stop = true;
          //     break;
          //   }
          // }

          // console.log('dij iter', curr);

          seen[curr] = true;
          seenCount++;
          // newGroup.push(curr);
          // remove(compsLeft, (c) => c === curr);

          components[curr].connections.forEach((connName) => {
            let currConn = curr < connName ? [curr, connName] : [connName, curr];
            if (
              !seen[connName] &&
              !isEqual(currConn, conn1) &&
              !isEqual(currConn, conn2) &&
              !isEqual(currConn, conn3)
            ) {
              stack.push(connName);
            }
          });
        }

        if (stop) {
          continue;
        }

        // console.log('seen count', seenCount);
        //
        // // console.log(compsLeft);
        //
        // // groups.push(newGroup);
        //
        // // if (compsLeft.length > 0 && groups.length >= 2) {
        // //   groups = [];
        // //   break;
        // // }
        // // }
        //
        // // console.log('ng', newGroup);
        if (seenCount !== compsCount) {
          return [
            [conn1, conn2, conn3],
            [seenCount, compsCount - seenCount, seenCount * (compsCount - seenCount)],
          ];
        }
        // if (groups.length === 2) {
        //   return [conn1, conn2, conn3, groups, groups.map((g) => g.length).reduce(multiply, 1)];
        // }
        // console.log(groups);
      }
    }
  }

  return result;
}
