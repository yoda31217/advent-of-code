export function calc(input: string) {
  let s = {};

  let instructions = input.trim().split('\n\n')[0].split('');
  let nameToNode = {};
  input
    .trim()
    .split('\n')
    .slice(2)
    .map((s) => s.trim())
    .forEach((line) => {
      let name = line.split('=')[0].trim();
      let left = line.split('(')[1].split(',')[0].trim();
      let right = line.split(',')[1].split(')')[0].trim();
      nameToNode[name] = { name, L: left, R: right, isFinal: name.endsWith('Z') };
    });

  return Object.keys(nameToNode)
    .filter((name) => name.endsWith('A'))
    .map((name) => nameToNode[name])
    .map((currentNode) => {
      let iterations = 0;

      while (true) {
        for (let i = 0; i < instructions.length; i++) {
          const instruction = instructions[i];
          currentNode = nameToNode[currentNode[instruction]];
          if (currentNode.isFinal) {
            return iterations * instructions.length + i + 1;
          }
        }
        iterations++;
      }
    })
    .reduce((a, b) => {
      let lar = Math.max(a, b);
      let small = Math.min(a, b);
      for (let i = lar; ; i += lar) {
        if (i % small == 0) return i;
      }
    }, 1);
}
