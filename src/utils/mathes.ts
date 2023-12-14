import { curry, max, min, multiply } from 'lodash';

export function arrAdd(array0: number[], array1: number[]) {
  return array0.map((_, i) => array0[i] + array1[i]);
}

export function arrSub(array0: number[], array1: number[]) {
  return arrAdd(array0, array1.map(curry(multiply)(-1)));
}

export function biFlip<A0, A1, R>(func: (a0: A0, a1: A1) => R): (a1: A1, a0: A0) => R {
  return (a1: A1, a0: A0) => func(a0, a1);
}

export function between(n: number, min: number, max: number) {
  return min <= n && n <= max;
}

export function minMax(...ns: number[]): [number, number] {
  return [min(ns), max(ns)];
}

export function biCombinations<T>(array: T[]): [T, T][] {
  return array.flatMap((elementJ: T, i: number) =>
    array.slice(i + 1).map((elementI: T) => [elementJ, elementI] as [T, T]),
  );
}
