import { countBy } from 'lodash';

let cardStrengths = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();

export function calc(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line: string) => {
      let [handStr, bidStr]: string[] = line.split(/\s+/);

      let bid: number = +bidStr;
      let cards: string[] = handStr.split('');

      let cardToCount = countBy(cards);

      let jokersCount = cardToCount['J'] || 0;
      delete cardToCount['J'];

      let cardCounts: number[] = Object.values(cardToCount).sort().reverse();

      let typeStrength: number = ((cardCounts[0] || 0) + jokersCount) * 10 + (cardCounts[1] || 0);
      let strength: number = cards.reduce(
        (strength, card) => strength * 100 + cardStrengths.indexOf(card),
        typeStrength,
      );

      return { bid, strength };
    })
    .sort((hand0, hand1) => hand0.strength - hand1.strength)
    .map((hand, handRank: number) => (handRank + 1) * hand.bid)
    .reduce((result: number, handWinnings: number) => result + handWinnings, 0);
}
