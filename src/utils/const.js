import { arraysEqual } from "./utils";

const MAX_ROUNDS_PER_PLAYER = 3;

const YATZY_TYPES = {
  ONE: "ONE",
  TWO: "TWO",
  THREE: "THREE",
  FOUR: "FOUR",
  FIVE: "FIVE",
  SIX: "SIX",
  ONE_PAIR: "ONE_PAIR",
  TWO_PAIRS: "TWO_PAIRS",
  THREE_OF_A_KIND: "THREE_OF_A_KIND",
  FOUR_OF_A_KIND: "FOUR_OF_A_KIND",
  SMALL_STREET: "SMALL_STREET",
  BIG_STREET: "BIG_STREET",
  FULL_HOUSE: "FULL_HOUSE",
  CHANCE: "CHANCE",
  YATZY: "YATZY",

}

const YATZY_COMBINATIONS = [
  {
    type: YATZY_TYPES.ONE,
    label: "Aces",
    section: "upper",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return diceValues.includes(1)
    },
    calculateScore(diceValues = []) {
      return diceValues.filter(value => value === 1).length * 1;
    }
  },
  {
    type: YATZY_TYPES.TWO,
    label: "Twos",
    section: "upper",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return diceValues.includes(2)
    },
    calculateScore(diceValues = []) {
      return diceValues.filter(value => value === 2).length * 2;
    }
  },
  {
    type: YATZY_TYPES.THREE,
    label: "Threes",
    section: "upper",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return diceValues.includes(3)
    },
    calculateScore(diceValues = []) {
      return diceValues.filter(value => value === 3).length * 3;
    }
  },
  {
    type: YATZY_TYPES.FOUR,
    label: "Fours",
    section: "upper",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return diceValues.includes(4)
    },
    calculateScore(diceValues = []) {
      return diceValues.filter(value => value === 4).length * 4;
    }
  },
  {
    type: YATZY_TYPES.FIVE,
    label: "Fives",
    section: "upper",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return diceValues.includes(5)
    },
    calculateScore(diceValues = []) {
      return diceValues.filter(value => value === 5).length * 5;
    }
  },
  {
    type: YATZY_TYPES.SIX,
    label: "Sixes",
    section: "upper",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return diceValues.includes(6)
    },
    calculateScore(diceValues = []) {
      return diceValues.filter(value => value === 6).length * 6;
    }
  },
  {
    type: YATZY_TYPES.ONE_PAIR,
    label: "One pair",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }

      return Object.values(counts).some(c => c >= 2);
    },
    calculateScore(diceValues = []) {
      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }

      const pairs = Object.entries(counts).filter(([value, count]) => count >= 2);
      return Math.max(...pairs.map(([value, count]) => parseInt(value))) * 2;
    }
  },
  {
    type: YATZY_TYPES.TWO_PAIRS,
    label: "Two pairs",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }

      const pairsCount = Object.values(counts).filter(c => c >= 2).length;
      return pairsCount >= 2;
    },
    calculateScore(diceValues = []) {
      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }

      const pairs = Object.entries(counts).filter(([value, count]) => count >= 2);
      const topTwoPairs = pairs
        .map(([value, count]) => parseInt(value))
        .sort((a, b) => b - a)
        .slice(0, 2);
      return topTwoPairs.reduce((sum, value) => sum + value, 0) * 2;
    }
  },
  {
    type: YATZY_TYPES.THREE_OF_A_KIND,
    label: "Three of a kind",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }

      return Object.values(counts).some(c => c >= 3);
    },
    calculateScore(diceValues = []) {
      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }

      const threeOfKind = Object.entries(counts).find(([value, count]) => count >= 3);
      return threeOfKind[0] * 3;
    }
  },
  {
    type: YATZY_TYPES.FOUR_OF_A_KIND,
    label: "Four of a kind",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }

      return Object.values(counts).some(c => c >= 4);
    },
    calculateScore(diceValues = []) {
      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }

      const fourOfKind = Object.entries(counts).find(([value, count]) => count >= 4);
      return fourOfKind[0] * 4;
    }
  },
  {
    type: YATZY_TYPES.SMALL_STREET,
    label: "Small street",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return arraysEqual(diceValues.sort(), [1, 2, 3, 4, 5])
    },
    calculateScore(diceValues = []) {
      return 15;
    }
  },
  {
    type: YATZY_TYPES.BIG_STREET,
    label: "Big street",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return arraysEqual(diceValues.sort(), [2, 3, 4, 5, 6])
    },
    calculateScore(diceValues = []) {
      return 20;
    }
  },
  {
    type: YATZY_TYPES.FULL_HOUSE,
    label: "Full House",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      const counts = {};
      for (const value of diceValues) {
        counts[value] = (counts[value] || 0) + 1;
      }
      const countValues = Object.values(counts);
      return countValues.includes(3) && countValues.includes(2);
    },
    calculateScore(diceValues = []) {
      return diceValues.reduce((sum, value) => sum + value, 0);
    }
  },
  {
    type: YATZY_TYPES.CHANCE,
    label: "Chance",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      return true;
    },
    calculateScore(diceValues = []) {
      return diceValues.reduce((sum, value) => sum + value, 0);
    }
  },
  {
    type: YATZY_TYPES.YATZY,
    label: "YATZY",
    section: "lower",
    isValidCombination(diceValues = []) {
      if (diceValues.length !== 5) return false;

      const firstValue = diceValues[0];
      if (diceValues.find(value => value !== firstValue)) {
        return false;
      }
      return true;
    },
    calculateScore(diceValues = []) {
      return diceValues.reduce((sum, value) => sum + value, 0);
    }
  },
];

const BONUS_MIN_NEEDED_POINTS = 63;
const BONUS_REWARD = 25;


const DEFAULT_DICES = [
  {
    id: 1,
    value: 1,
    isSelected: false
  },
  {
    id: 2,
    value: 1,
    isSelected: false
  },
  {
    id: 3,
    value: 1,
    isSelected: false
  },
  {
    id: 4,
    value: 1,
    isSelected: false
  },
  {
    id: 5,
    value: 1,
    isSelected: false
  }
]

const DEFAULT_SCORE = [
  {
    playerId: 1,
    score: [
      {
        type: YATZY_TYPES.ONE,
        score: undefined
      },
      {
        type: YATZY_TYPES.TWO,
        score: undefined
      },
      {
        type: YATZY_TYPES.THREE,
        score: undefined
      },
      {
        type: YATZY_TYPES.FOUR,
        score: undefined
      },
      {
        type: YATZY_TYPES.FIVE,
        score: undefined
      },
      {
        type: YATZY_TYPES.SIX,
        score: undefined
      },
      {
        type: YATZY_TYPES.ONE_PAIR,
        score: undefined
      },
      {
        type: YATZY_TYPES.TWO_PAIRS,
        score: undefined
      },
      {
        type: YATZY_TYPES.THREE_OF_A_KIND,
        score: undefined
      },
      {
        type: YATZY_TYPES.FOUR_OF_A_KIND,
        score: undefined
      },
      {
        type: YATZY_TYPES.SMALL_STREET,
        score: undefined
      },
      {
        type: YATZY_TYPES.BIG_STREET,
        score: undefined
      },
      {
        type: YATZY_TYPES.FULL_HOUSE,
        score: undefined
      },
      {
        type: YATZY_TYPES.CHANCE,
        score: undefined
      },
      {
        type: YATZY_TYPES.YATZY,
        score: undefined
      }

    ]
  },
  {
    playerId: 2,
    score: [
      {
        type: YATZY_TYPES.ONE,
        score: undefined
      },
      {
        type: YATZY_TYPES.TWO,
        score: undefined
      },
      {
        type: YATZY_TYPES.THREE,
        score: undefined
      },
      {
        type: YATZY_TYPES.FOUR,
        score: undefined
      },
      {
        type: YATZY_TYPES.FIVE,
        score: undefined
      },
      {
        type: YATZY_TYPES.SIX,
        score: undefined
      },
      {
        type: YATZY_TYPES.ONE_PAIR,
        score: undefined
      },
      {
        type: YATZY_TYPES.TWO_PAIRS,
        score: undefined
      },
      {
        type: YATZY_TYPES.THREE_OF_A_KIND,
        score: undefined
      },
      {
        type: YATZY_TYPES.FOUR_OF_A_KIND,
        score: undefined
      },
      {
        type: YATZY_TYPES.SMALL_STREET,
        score: undefined
      },
      {
        type: YATZY_TYPES.BIG_STREET,
        score: undefined
      },
      {
        type: YATZY_TYPES.FULL_HOUSE,
        score: undefined
      },
      {
        type: YATZY_TYPES.CHANCE,
        score: undefined
      },
      {
        type: YATZY_TYPES.YATZY,
        score: undefined
      }

    ]
  },
  {
    playerId: 3,
    score: [
      {
        type: YATZY_TYPES.ONE,
        score: undefined
      },
      {
        type: YATZY_TYPES.TWO,
        score: undefined
      },
      {
        type: YATZY_TYPES.THREE,
        score: undefined
      },
      {
        type: YATZY_TYPES.FOUR,
        score: undefined
      },
      {
        type: YATZY_TYPES.FIVE,
        score: undefined
      },
      {
        type: YATZY_TYPES.SIX,
        score: undefined
      },
      {
        type: YATZY_TYPES.ONE_PAIR,
        score: undefined
      },
      {
        type: YATZY_TYPES.TWO_PAIRS,
        score: undefined
      },
      {
        type: YATZY_TYPES.THREE_OF_A_KIND,
        score: undefined
      },
      {
        type: YATZY_TYPES.FOUR_OF_A_KIND,
        score: undefined
      },
      {
        type: YATZY_TYPES.SMALL_STREET,
        score: undefined
      },
      {
        type: YATZY_TYPES.BIG_STREET,
        score: undefined
      },
      {
        type: YATZY_TYPES.FULL_HOUSE,
        score: undefined
      },
      {
        type: YATZY_TYPES.CHANCE,
        score: undefined
      },
      {
        type: YATZY_TYPES.YATZY,
        score: undefined
      }

    ]
  }
]

export {
  MAX_ROUNDS_PER_PLAYER,
  YATZY_TYPES,
  YATZY_COMBINATIONS,
  BONUS_MIN_NEEDED_POINTS,
  BONUS_REWARD,
  DEFAULT_DICES,
  DEFAULT_SCORE
}