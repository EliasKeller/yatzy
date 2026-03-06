"use client";

import { useEffect, useState } from "react";
import Dice from "./components/dice";
import { DEFAULT_DICES, DEFAULT_SCORE, YATZY_COMBINATIONS, YATZY_TYPES } from "@/utils/const";
import Scoreboard from "./components/scoreboard";
import CombinationPicker from "./components/combinationPicker";
import { isCombinationAvailableForPlayer } from "@/utils/utils";

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


  /* ----------------------------------------------------------- 
                                STATES 
  -----------------------------------------------------------  */
  const [dices, setDices] = useState(DEFAULT_DICES);
  const [rollTrigger, setRollTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [players, setPlayers] = useState(defaultPlayers);
  const [score, setScore] = useState(DEFAULT_SCORE);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRoundOfPlayer, setCurrentRoundOfPlayer] = useState(0);
  const [isCombinationPickerOpen, setIsCombinationPickerOpen] = useState(false);
  const [allowedCombinations, setAllowedCombinations] = useState([]);


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
    setDices(prev =>
      prev.map((d, i) => (i === index ? { ...d, value } : d))
    );
  };

  const cloneDices = (arr) => arr.map(d => ({ ...d }));

  const switchPlayer = () => {
    setCurrentRoundOfPlayer(0);
    setCurrentPlayerIndex((currentIndex) => (currentIndex + 1) % players.length);
    setDices(cloneDices(DEFAULT_DICES));
    setResetTrigger((resetCount) => resetCount + 1);
  }

  const onDiceSelect = (id) => {
    setDices(prev =>
      prev.map(d =>
        d.id === id ? { ...d, isSelected: !d.isSelected } : d
      )
    );
  };

  const onCombinationSelect = (selectedCombination) => {
    setIsCombinationPickerOpen(false);
    
    const playerScore = score.find((score) => score.playerId === players[currentPlayerIndex].id);
    playerScore.score = playerScore.score.map(combination => {
      if (combination.type === selectedCombination.type) {
        return { ...combination, score: selectedCombination.calculateScore(dices.map(dice => dice.value)) };
      } else {
        return { ...combination };
        }
      });

    setScore(prev => prev.map(score => score.playerId === playerScore.playerId ? playerScore : score));
    switchPlayer();
  }

  /* ----------------------------------------------------------- 
                              EFFECT 
-----------------------------------------------------------  */

  useEffect(() => {
    if (currentRoundOfPlayer >= MAX_ROUNDS_PER_PLAYER) {

      setTimeout(() => {
        console.log("test test")
        const diceValues = dices.map(dice => dice.value);
        const allowed = [];
        YATZY_COMBINATIONS.forEach((combination) => {
          if (combination.isValidCombination(diceValues) && isCombinationAvailableForPlayer(players[currentPlayerIndex].id, combination.type, score)) {
            allowed.push(combination);

          }
        })
        console.log(allowed)
        setAllowedCombinations(allowed);
        setIsCombinationPickerOpen(true);

      }, 1000);
    }
  }, [dices]);

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
      <button
        onClick={rollAll}
        className={`px-8 py-3 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-700 ${!(currentRoundOfPlayer < MAX_ROUNDS_PER_PLAYER) ? "invisible" : ""}`}
      >
        WÜRFELN!
      </button>
      <CombinationPicker onSelect={onCombinationSelect} isOpen={isCombinationPickerOpen} allowedCombinations={allowedCombinations} />
      <Scoreboard players={players} currentScore={score} />
    </div>
  );
}
