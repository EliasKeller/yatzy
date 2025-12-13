"use client";

import { useState } from "react";
import Dice from "./components/dice";

export default function Home() {
  const ROUNDS_PER_PLAYER = 3;
  const PLAYER_LIST = ["Player 1", "Player 2"];
  const INIT_DICES = [
    { id: 1, value: 1, selected: false },
    { id: 2, value: 1, selected: false },
    { id: 3, value: 1, selected: false },
    { id: 4, value: 1, selected: false },
    { id: 5, value: 1, selected: false },
  ];

  const [dices, setDices] = useState(INIT_DICES);

  const [rollTrigger, setRollTrigger] = useState(0);
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_LIST[0]);
  const [roundOfCurrentPlayer, setRoundOfCurrentPlayer] = useState(0);

  
  const rollDice = () =>  {
    console.log("--------- Rolling Dice ---------");

    setRollTrigger((v) => v + 1);
    setRoundOfCurrentPlayer((index) => (index + 1));
    if (roundOfCurrentPlayer + 1 == ROUNDS_PER_PLAYER) {
      changePlayer();
      setDices(INIT_DICES);
    }

    console.log("----------- Current Game State -----------");
    console.log("Dices: ", dices);
    console.log("------------------------------------------");
  };

  const changePlayer = () => {
    console.log("--------- Changing Player ---------");
    
    const currentIndex = PLAYER_LIST.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % PLAYER_LIST.length;
    setCurrentPlayer(PLAYER_LIST[nextIndex]);
    setRoundOfCurrentPlayer(0);
    setClearSelectionTrigger((v) => v + 1);
  };

  const onDiceClick = (id) => {
    console.log("Toggling selection for dice " + id);

    const updatedDices = dices.map((dice) => {
      if (dice.id === id) {
        return { ...dice, selected: !dice.selected };
      }
      return dice;
    });

    setDices(updatedDices);
  };

  const setDiceValue = (id, value) => {
    const updatedDices = dices.map((dice) => {
      if (dice.id === id) {
        return { ...dice, value: value };
      }
      return dice;
    });
    
    setDices(updatedDices);
  }



  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">{currentPlayer} du bist dran ({roundOfCurrentPlayer + 1}. Runde)</h1>
      <div className="flex gap-4 flex-wrap justify-center">

        {dices.map((dice) => (
          <Dice
            key={dice.id}
            id={dice.id}
            rollTrigger={rollTrigger}
            onClick={onDiceClick}
            onValueChange={setDiceValue}
            isSelected={dice.selected}
          />
        ))}
      </div>

      <button
        onClick={rollDice}
        className="px-8 py-3 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-600"
      >
        wÜRFELN!
      </button>
    </div>
  );
}
