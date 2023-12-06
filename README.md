# `Advent of Code` Challenge Solutions

Here you can see my solutions for different [AoC](https://adventofcode.com/) day challenges.

### Requirements

- Linux/MacOS
- NodeJS

### Test

To test any solution run:

```
./run.sh $YEAR $DAY $PART
```

For example:

```
./run.sh 2023 06 1

./run.sh 2023 01 2
```

### Source

Everything is inside `./src` directory. Bootstrappers are `./run.sh` and `./src/index.ts` files.

Every solution - is a TypeScript module with exported `function calc(input: string): any`.
Which is called from `./src/index.ts` with provided arguments.
