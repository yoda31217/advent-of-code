import { trim } from 'lodash';

export function splitBlocks(str: string) {
  return str.trim().split(/\n\n/g).map(splitLines);
}

export function splitLines(str: string) {
  return str.trim().split(/\n/g).map(trim);
}

export function splitSpaced(str: string) {
  return str.trim().split(/\s+/g);
}

export function splitByComa(str: string) {
  return str.trim().split(/\s*,\s*/g);
}

export function splitByDotsWithoutEmpty(str: string) {
  return str.trim().split(/\s*\.+\s*/g);
}

export function splitSpacedNumbers(str: string) {
  return splitSpaced(str).map(Number);
}

export function splitByComaNumbers(str: string) {
  return splitByComa(str).map(Number);
}

export function transpose(lines: string[]): string[] {
  return lines[0].split('').map((_, i) => lines.map((line) => line.charAt(i)).join(''));
}

export type Grid<T> = [T, number, number, T[]][];

export function gridify(lines: string[]): Grid<string> {
  return lines.flatMap((line, y, lines) => {
    return line.split('').map((char, x) => [char, x, y, lines]);
  }) as [string, number, number, string[]][];
}
