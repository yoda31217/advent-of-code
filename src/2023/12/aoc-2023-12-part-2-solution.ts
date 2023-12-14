import { add, range, repeat, sum } from 'lodash';
import { splitLines } from '../../utils/strings';

function countReplacements(
  index: number,
  str: string,
  expectedCounts: number[],
  ig: boolean,
  cgi: number,
  cgc: number,
  hashLeft: number,
  cache: any,
) {
  let key = `${index}-${ig}-${cgi}-${cgc}-${hashLeft}`;
  let value = cache[key];

  if (value !== undefined) {
    return value as number;
  }

  value = countReplacementsS(index, str, expectedCounts, ig, cgi, cgc, hashLeft, cache);
  cache[key] = value;
  return value;
}

function countReplacementsS(
  index: number,
  str: string,
  expectedCounts: number[],
  ig: boolean,
  cgi: number,
  cgc: number,
  hashLeft: number,
  cache: any,
) {
  // console.log(arguments);

  if (index >= str.length) {
    if (ig) {
      if (expectedCounts[cgi] !== cgc) {
        return 0;
      }

      if (cgi !== expectedCounts.length - 1) {
        return 0;
      }

      return 1;
    } else {
      if (cgi !== expectedCounts.length) {
        return 0;
      }

      return 1;
    }
  }

  let c = str.charAt(index);

  if (c === '.') {
    return calcOnDot(index, str, expectedCounts, ig, cgi, cgc, hashLeft, cache);
  }

  if (c === '#') {
    return calcOnHash(index, str, expectedCounts, ig, cgi, cgc, hashLeft, cache);
  }

  return (
    calcOnDot(index, str, expectedCounts, ig, cgi, cgc, hashLeft, cache) +
    calcOnHash(index, str, expectedCounts, ig, cgi, cgc, hashLeft, cache)
  );
}

function calcOnHash(
  index: number,
  str: string,
  expectedCounts: number[],
  ig: boolean,
  cgi: number,
  cgc: number,
  hashLeft: number,
  cache: any,
) {
  if (expectedCounts[cgi] === undefined) {
    return 0;
  }

  if (expectedCounts[cgi] < cgc + 1) {
    return 0;
  }

  if (hashLeft === 0) {
    return 0;
  }

  return countReplacements(index + 1, str, expectedCounts, true, cgi, cgc + 1, hashLeft - 1, cache);
}

function calcOnDot(
  index: number,
  str: string,
  expectedCounts: number[],
  ig: boolean,
  cgi: number,
  cgc: number,
  hashLeft: number,
  cache: any,
) {
  if (ig) {
    if (expectedCounts[cgi] !== cgc) {
      return 0;
    }

    return countReplacements(index + 1, str, expectedCounts, false, cgi + 1, 0, hashLeft, cache);
  } else {
    return countReplacements(index + 1, str, expectedCounts, false, cgi, cgc, hashLeft, cache);
  }
}

export function calc(input: string) {
  let lines: string[] = splitLines(input);

  return lines
    .map((line, i) => {
      let N = 5;

      let str = line.split(/\s+/)[0];
      let counts = line.split(/\s+/)[1].split(',').map(Number);

      const countsN = range(N).reduce((c) => [...c, ...counts], []);
      const strN = repeat('?' + str, N).slice(1);

      console.log(i, line);

      // if (counts.indexOf(max(counts)) >= counts.length / 2) {
      //   counts = reverse(counts);
      //   str = str.split('').reverse().join('');
      // }

      let r;

      r = countReplacements(0, strN, countsN, false, 0, 0, sum(counts) * N, {});

      // let c1 = calc2(0, counts, str, 0);
      // let c2 = calc2(
      //   0,
      //   range(2).reduce((c) => [...c, ...counts], []),
      //   repeat('?' + str, 2).slice(1),
      //   0,
      // );
      // r = c1 * Math.pow(c2 / c1, N - 1);
      // console.log('    ', c1, c2, r);

      // if (Math.floor(r) !== r) {
      // r = calc2(0, countsN, strN, 0, {});

      // r = countReplacementsXXX(
      //   0,
      //   repeat('?' + str, N).slice(1),
      //   '',
      //   range(N).reduce((c) => [...c, ...counts], []),
      // );
      // }

      console.log(r);
      return r;
    })
    .reduce(add, 0);
}

function calc2(groupIndex: number, counts: number[], str: string, startPosition: number, cache: any) {
  let key = `${groupIndex}-${startPosition}`;
  let value = cache[key];

  if (value !== undefined) {
    return value as number;
  }

  value = calc2Simple(groupIndex, counts, str, startPosition, cache);
  cache[key] = value;
  return value;
}

function calc2Simple(groupIndex: number, counts: number[], str: string, startPosition: number, cache: any) {
  if (startPosition >= str.length) {
    let res = groupIndex >= counts.length ? 1 : 0;
    if (res) {
      // console.log(repeat('  ', groupIndex) + 'res -> ', res);
    }
    return res;
  }

  if (groupIndex >= counts.length) {
    let res = (str.substring(startPosition) || '').includes('#') ? 0 : 1;
    if (res) {
      // console.log(repeat('  ', groupIndex) + 'res -> ', res);
    }
    return res;
  }

  // console.log(repeat('  ', groupIndex) + 'cal -> ', startPosition, groupIndex);

  let r = 0;

  let dotPlace = str.indexOf('.', startPosition);

  for (let position = startPosition; position < str.length; position++) {
    // if (dotPlace < position + counts[groupIndex] && dotPlace >= position) {
    //   let closestHash = str.indexOf('#', position);
    //   if (closestHash >= position && closestHash < counts[groupIndex]) {
    //     break;
    //   }
    //   position = dotPlace;
    //   dotPlace = str.indexOf('.', dotPlace + 1);
    //   continue;
    // }

    // console.log('calc -> ', position, groupIndex);
    if (canPlaceGroup(groupIndex, counts, str, position)) {
      r += calc2(groupIndex + 1, counts, str, position + counts[groupIndex] + 1, cache);
    }

    if (str.charAt(position) === '#') {
      break;
    }
  }

  return r;
}

function canPlaceGroup(groupIndex: number, counts: number[], str: string, position: number) {
  // console.log('cpg -> ', arguments);
  let count = counts[groupIndex];
  let substr = str.substring(position, position + count + 1);

  let canPlace =
    str.length >= position + count &&
    str.charAt(position + count) !== '#' &&
    !str.substring(position, position + count).includes('.');

  // let canPlace = substr.length >= count && substr.charAt(count) !== '#' && !substr.includes('.');

  // console.log(repeat('  ', groupIndex) + 'can -> ', position, groupIndex, canPlace);

  return canPlace;
}
