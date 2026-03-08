"use client";

import { useEffect, useState } from "react";
import Dice from "./components/dice";
import { DEFAULT_DICES, DEFAULT_SCORE, MAX_ROUNDS_PER_PLAYER, YATZY_COMBINATIONS, YATZY_TYPES } from "@/utils/const";
import { isCombinationAvailableForPlayer } from "@/utils/utils";
import Scoreboard from "./components/scoreboard";
import CombinationPicker from "./components/combinationPicker";

export default function Home() {
  /* ----------------------------------------------------------- 
                                CONSTANTS 
  -----------------------------------------------------------  */
  const defaultPlayers = [
    {
      id: 1,
      name: "Pkjasdfkjahsfklasjlasjflasjlasfjalsfkj1",
      score: 0
    },
    {
      id: 2,
      name: "asdf 2",
      score: 0
    },
    {
      id: 3,
      name: "Pkjasdfkjahsfklasjlasjflasjlasfjalsfkj3",
      score: 0
    },
  ];

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 bg-gray-600 px-4 py-6 sm:py-8">
      <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-white">Yatzy</h1>

      {/* ---- Player Cards ---- */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 w-full max-w-md md:max-w-none">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={[
              "relative flex items-center",
              "flex-1 min-w-[80px] max-w-[140px] sm:min-w-[100px] sm:max-w-[180px]",
              "h-16", // feste Höhe für alle Cards
              "px-3 sm:px-4 md:px-6",
              "rounded-xl shadow-lg transition-all duration-300",
              index === currentPlayerIndex
                ? "bg-emerald-500 text-gray-900 ring-2 ring-emerald-300"
                : "text-white border border-dotted",
            ].join(" ")}
          >
            {index === currentPlayerIndex && (
              <div className="absolute inset-x-0 bottom-3 grid grid-cols-3 gap-1 px-3">
                {Array.from({ length: currentRoundOfPlayer }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1 bg-emerald-900 rounded-full"
                  />
                ))}
              </div>
            )}

            {/* Name */}
            <h3 className="text-sm sm:text-lg md:text-xl font-bold truncate">
              {player.name}
            </h3>
          </div>
        ))}
      </div>

      {/* ---- Dices ---- */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center max-w-xs sm:max-w-md md:max-w-none">
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
        className={`px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-700 cursor-pointer ${!(currentRoundOfPlayer < MAX_ROUNDS_PER_PLAYER) ? "invisible" : ""}`}
      >
        {"Roll the dices!"}
      </button>

      <CombinationPicker onSelect={onCombinationSelect} isOpen={isCombinationPickerOpen} allowedCombinations={allowedCombinations} diceValues={dices.map(dice => dice.value)} />
      <Scoreboard players={players} currentScore={score} isCombinationPickerOpen={isCombinationPickerOpen} />
    </div>
  );
}
