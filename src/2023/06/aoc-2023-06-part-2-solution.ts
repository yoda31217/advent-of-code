export function calc(input: string) {
  let time: number = +input.split('\n')[0].split(':')[1].replace(/\s+/g, '');
  let distance: number = +input.split('\n')[1].split(':')[1].replace(/\s+/g, '');

  let waysToWinCount: number = 0;

  for (let i = 0; i <= time; i++) {
    if ((time - i) * i >= distance) {
      waysToWinCount++;
    }
  }

  return waysToWinCount;
}
