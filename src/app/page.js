"use client";

import { useState } from "react";
import Dice from "./components/dice";
import { DEFAULT_DICES } from "@/utils/const";
import Scoreboard from "./components/scoreboard";

export default function Home() {
  /* ----------------------------------------------------------- 
                                CONSTANTS 
  -----------------------------------------------------------  */
  const defaultPlayers = [
    {
      id: 1,
      name: "Player 1",
      score: 0
    },
    {
      id: 2,
      name: "Player 2",
      score: 0
    },
    {
      id: 3,
      name: "Player 3",
      score: 0
    }
  ];

  const MAX_ROUNDS_PER_PLAYER = 3;

  const exampleScore = [
    {
      playerId: 1,
      score: {
        type: "One",
        score: 4
      }
    }
  ]
  
  /* ----------------------------------------------------------- 
                                STATES 
  -----------------------------------------------------------  */
  const [dices, setDices] = useState(DEFAULT_DICES);
  const [rollTrigger, setRollTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [players, setPlayers] = useState(defaultPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRoundOfPlayer, setCurrentRoundOfPlayer] = useState(0);
   

  /* ----------------------------------------------------------- 
                                HELPERS 
  -----------------------------------------------------------  */

  const rollAll = () => {
    if (currentRoundOfPlayer < MAX_ROUNDS_PER_PLAYER) {
      setCurrentRoundOfPlayer((currentRound) => currentRound + 1);
      setRollTrigger((rollCount) => rollCount + 1);
    } else {
      switchPlayer();
    }
    
  };

  const updateDiceValue = (index, value) => {
    dices[index].value = value;
    setDices([...dices]);
};

  const switchPlayer = () => {
      setCurrentRoundOfPlayer(0);
      setCurrentPlayerIndex((currentIndex) => (currentIndex + 1) % players.length);    
      setDices(DEFAULT_DICES);
      setResetTrigger((resetCount) => resetCount + 1);
  }

  const getAllDiceValues = () => {
    console.log("Aktuelle Würfelwerte:", dices);
  };

  const onDiceSelect = (idOfDiceWhichNeedsToBeSelected) => {
    dices.forEach(dice => {
      if (dice.id === idOfDiceWhichNeedsToBeSelected){
        dice.isSelected = !dice.isSelected;
      }
    })

    setDices(dices)
  }

  /* ----------------------------------------------------------- 
                                RENDER 
  -----------------------------------------------------------  */

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 bg-gray-600">
      <h1 className="text-4xl font-bold">Yatzy</h1>
      <h1 className="text-2xl font-semibold">{currentRoundOfPlayer === 0 ? "" : `${"Runde " + (currentRoundOfPlayer) + " - "}`}{players[currentPlayerIndex].name} ist am Zug</h1>
      <div className="flex gap-4">
        {players.map((player, index) => (
          <div key={player.id} className={["px-6 py-4 rounded-lg shadow-md", index === currentPlayerIndex ? "bg-emerald-400 text-black" : "bg-gray-800 text-white"].join(" ")}>
            <h2 className="text-2xl font-semibold">{player.name}</h2>
          </div>
        ))}
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        {dices.map((dice, index) => (
          <Dice key={dice.id} 
            id={dice.id} 
            index={index} 
            initValue={dice.value} 
            initIsSelected={dice.isSelected} 
            rollTrigger={rollTrigger} 
            resetTrigger={resetTrigger} 
            onValueChange={updateDiceValue}
            onDiceSelect={onDiceSelect}
            isSelectionDisabled={currentRoundOfPlayer === 0}
          />
        ))}
      </div>
        {
          currentRoundOfPlayer < MAX_ROUNDS_PER_PLAYER ? (
            <button
              onClick={rollAll}
              className="px-8 py-3 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-700"
            >
              WÜRFELN!
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={getAllDiceValues}
                className="px-8 py-3 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-700"
              >
                Score eintragen
              </button>
              <button
                onClick={switchPlayer}
                className="px-8 py-3 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-700"
              >
              Spieler wechseln
              </button>
            </div>
          )
        }

      <Scoreboard players={players} />
    </div>
  );
}
