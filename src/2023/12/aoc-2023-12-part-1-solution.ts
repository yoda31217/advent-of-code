import { add, identity, isEqual } from 'lodash';
import { splitByComaNumbers, splitLines, splitSpaced } from '../../utils/strings';

export function countReplacementsXXX(i: number, records: string, arrangedRecords: string, groups: number[]) {
  if (i === records.length) {
    return isEqual(
      // splitByDotsWithoutEmpty(arrangedRecords).map((recordsGroup) => recordsGroup.length),
      arrangedRecords
        .split(/\.+/g)
        .filter(identity)
        .map((recordsGroup) => recordsGroup.length),
      groups,
    )
      ? 1
      : 0;
  }

  let record = records.charAt(i);

  return '.#'.includes(record)
    ? countReplacementsXXX(i + 1, records, arrangedRecords + record, groups)
    : countReplacementsXXX(i + 1, records, arrangedRecords + '.', groups) +
        countReplacementsXXX(i + 1, records, arrangedRecords + '#', groups);
}

export function calc(input: string) {
  return splitLines(input)
    .map((line) => {
      let [records, groupsStr] = splitSpaced(line);
      let groups = splitByComaNumbers(groupsStr);
      return countReplacementsXXX(0, records, '', groups);
    })
    .reduce(add, 0);
}
