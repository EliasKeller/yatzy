const YATZY_COMBINATIONS = [
  { type: "ONE", label: "Aces", section: "upper" },
  { type: "TWO", label: "Twos", section: "upper" },
  { type: "THREE", label: "Threes", section: "upper" },
  { type: "FOUR", label: "Fours", section: "upper" },
  { type: "FIVE", label: "Fives", section: "upper" },
  { type: "SIX", label: "Sixes", section: "upper" },
  { type: "ONE_PAIR", label: "One pair", section: "lower" },
  { type: "TWO_PAIRS", label: "Two pairs", section: "lower" },
  { type: "THREE_OF_A_KIND", label: "Three of a kind", section: "lower" },
  { type: "FOUR_OF_A_KIND", label: "Four of a kind", section: "lower" },
  { type: "SMALL_STREET", label: "Small street", section: "lower" },
  { type: "BIG_STREET", label: "Big street", section: "lower" },
  { type: "FULL_HOUSE", label: "Full House", section: "lower" },
  { type: "CHANCE", label: "Chance", section: "lower" },
  { type: "YATZY", label: "YATZY", section: "lower" },
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
    YATZY_COMBINATIONS,
    DEFAULT_DICES
}