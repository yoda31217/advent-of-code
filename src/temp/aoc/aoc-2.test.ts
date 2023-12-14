import { readFileSync } from 'fs';

const CUBE_COLORS = ['red', 'green', 'blue'] as const;

type CubeColor = (typeof CUBE_COLORS)[number];

type CubeSet = { [colorCubeColor in CubeColor]: number };

class Game {
  readonly id: number;
  readonly cubeSets: CubeSet[];

  constructor(readonly str: string) {
    const [gameIdStr, cubeSetsStr] = str.split(/\s*:\s*/);

    const [_, idStr] = gameIdStr.split(/\s+/);
    this.id = Number(idStr);

    this.cubeSets = cubeSetsStr.split(/\s*;\s*/).map((cubeSetStr) => {
      const cubeSet: CubeSet = { red: 0, green: 0, blue: 0 };

      cubeSetStr.split(/\s*,\s*/).forEach((cubesCountColorStr) => {
        const [cubesCountStr, cubesColorStr] = cubesCountColorStr.split(/\s+/);
        cubeSet[cubesColorStr as CubeColor] = Number(cubesCountStr);
      });

      return cubeSet;
    });
  }

  isPossible(): boolean {
    for (const cubeSet of this.cubeSets) {
      if (cubeSet.red > 12 || cubeSet.green > 13 || cubeSet.blue > 14) {
        return false;
      }
    }
    return true;
  }

  calculateMinCubeSetPower(): number {
    return (
      this.cubeSets.map((cubeSet) => cubeSet.red).reduce((power, count) => (count > power ? count : power), 0) *
      this.cubeSets.map((cubeSet) => cubeSet.green).reduce((power, count) => (count > power ? count : power), 0) *
      this.cubeSets.map((cubeSet) => cubeSet.blue).reduce((power, count) => (count > power ? count : power), 0)
    );
  }

  static getGames(gamesStr: string): Game[] {
    return gamesStr
      .trim()
      .split(/\s*\n\s*/)
      .map((gamesStr) => new Game(gamesStr.trim()));
  }

  static getPossibleGames(gamesStr: string): Game[] {
    return this.getGames(gamesStr).filter((game) => game.isPossible());
  }

  static calculatePossibleGameIdsSum(gamesStr: string): number {
    return this.getPossibleGames(gamesStr).reduce((sum, game) => sum + game.id, 0);
  }

  static calculateGameMinCubeSetPowerSum(gamesStr: string): number {
    return this.getGames(gamesStr)
      .map((game) => game.calculateMinCubeSetPower())
      .reduce((sum, power) => sum + power, 0);
  }
}

describe('AoC-2', () => {
  test('utils', () => {
    const game = new Game('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green');

    expect(game.id).toEqual(1);

    expect(game.cubeSets.length).toEqual(3);
    expect(game.cubeSets[0].red).toEqual(4);
    expect(game.cubeSets[0].green).toEqual(0);
    expect(game.cubeSets[0].blue).toEqual(3);
    expect(game.cubeSets[1].red).toEqual(1);
    expect(game.cubeSets[1].green).toEqual(2);
    expect(game.cubeSets[1].blue).toEqual(6);
    expect(game.cubeSets[2].red).toEqual(0);
    expect(game.cubeSets[2].green).toEqual(2);
    expect(game.cubeSets[2].blue).toEqual(0);
  });

  test('test', () => {
    expect(new Game('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green').isPossible()).toEqual(true);
    expect(new Game('Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue').isPossible()).toEqual(true);
    expect(new Game('Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red').isPossible()).toEqual(
      false,
    );
    expect(new Game('Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red').isPossible()).toEqual(
      false,
    );
    expect(new Game('Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green').isPossible()).toEqual(true);

    expect(
      Game.calculatePossibleGameIdsSum(`
      Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
      Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
      Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
      Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
      Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
    `),
    ).toEqual(8);

    expect(new Game('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green').calculateMinCubeSetPower()).toEqual(48);
    expect(
      new Game('Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue').calculateMinCubeSetPower(),
    ).toEqual(12);
    expect(
      new Game('Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red').calculateMinCubeSetPower(),
    ).toEqual(1560);
    expect(
      new Game('Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red').calculateMinCubeSetPower(),
    ).toEqual(630);
    expect(new Game('Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green').calculateMinCubeSetPower()).toEqual(36);

    expect(
      Game.calculateGameMinCubeSetPowerSum(`
      Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
      Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
      Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
      Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
      Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
    `),
    ).toEqual(2286);
  });

  test('prod', async () => {
    const gamesStr = readFileSync(__dirname + '/aoc-2.input.txt', { encoding: 'utf-8' });
    expect(Game.calculatePossibleGameIdsSum(gamesStr)).toEqual(2265);
    expect(Game.calculateGameMinCubeSetPowerSum(gamesStr)).toEqual(64097);
  });
});
