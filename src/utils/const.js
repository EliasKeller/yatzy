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
  { type: YATZY_TYPES.ONE, label: "Aces", section: "upper" },
  { type: YATZY_TYPES.TWO, label: "Twos", section: "upper" },
  { type: YATZY_TYPES.THREE, label: "Threes", section: "upper" },
  { type: YATZY_TYPES.FOUR, label: "Fours", section: "upper" },
  { type: YATZY_TYPES.FIVE, label: "Fives", section: "upper" },
  { type: YATZY_TYPES.SIX, label: "Sixes", section: "upper" },
  { type: YATZY_TYPES.ONE_PAIR, label: "One pair", section: "lower" },
  { type: YATZY_TYPES.TWO_PAIRS, label: "Two pairs", section: "lower" },
  { type: YATZY_TYPES.THREE_OF_A_KIND, label: "Three of a kind", section: "lower" },
  { type: YATZY_TYPES.FOUR_OF_A_KIND, label: "Four of a kind", section: "lower" },
  { type: YATZY_TYPES.SMALL_STREET, label: "Small street", section: "lower" },
  { type: YATZY_TYPES.BIG_STREET, label: "Big street", section: "lower" },
  { type: YATZY_TYPES.FULL_HOUSE, label: "Full House", section: "lower" },
  { type: YATZY_TYPES.CHANCE, label: "Chance", section: "lower" },
  { type: YATZY_TYPES.YATZY, label: "YATZY", section: "lower" },
];


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

export {
    YATZY_TYPES,
    YATZY_COMBINATIONS,
    DEFAULT_DICES
}