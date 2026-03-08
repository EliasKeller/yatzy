"use client";

import { useEffect, useState } from "react";
import Dice from "./components/dice";
import { DEFAULT_DICES, DEFAULT_SCORE, INITIAL_SCORE_OF_PLAYER, MAX_ROUNDS_PER_PLAYER, YATZY_COMBINATIONS, YATZY_TYPES } from "@/utils/const";
import { isCombinationAvailableForPlayer } from "@/utils/utils";
import Scoreboard from "./components/scoreboard";
import CombinationPicker from "./components/combinationPicker";
import PlayerSetup from "./components/player-setup";
import useLocalStorage from "./hooks/useLocalStorage";

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
    },
  ];

  /* ----------------------------------------------------------- 
                                STATES 
  -----------------------------------------------------------  */
  const [gameBoard, setGameBoard] = useLocalStorage("gameBoard", null);
  const [dices, setDices] = useState(DEFAULT_DICES);
  const [rollTrigger, setRollTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isCombinationPickerOpen, setIsCombinationPickerOpen] = useState(false);
  const [allowedCombinations, setAllowedCombinations] = useState([]);


  /* ----------------------------------------------------------- 
                                HELPERS 
  -----------------------------------------------------------  */
  const handleStartGame = (players) => {
    const initialGameBoard = {
      players: players.map(player => ({
        ...player,
        score: INITIAL_SCORE_OF_PLAYER
      })),
      state: {
        activePlayerId: players[0].id,
        currentRound: 0,
        //dices: DEFAULT_DICES,
      }

    }

    setGameBoard(initialGameBoard);
  }

  const rollAll = () => {
    if (gameBoard.state.currentRound < MAX_ROUNDS_PER_PLAYER) {
      setGameBoard((prevGameBoard) => ({
        ...prevGameBoard,
        state: {
          ...prevGameBoard.state,
          currentRound: prevGameBoard.state.currentRound + 1,
        }
      }));
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

    setGameBoard((prevGameBoard) => {
      const currentIndex = prevGameBoard.players.findIndex(player => player.id === prevGameBoard.state.activePlayerId);
      const nextPlayerId = prevGameBoard.players[(currentIndex + 1) % prevGameBoard.players.length].id;
      return {
        ...prevGameBoard,
        state: {
          ...prevGameBoard.state,
          activePlayerId: nextPlayerId,
          currentRound: 0,
        }
      }
    });

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
    const diceValues = dices.map(dice => dice.value);
    let updatedPlayerScore = gameBoard
      .find((player) => player.id === gameBoard.state.activePlayerId).score
      .map(combination => {
        if (combination.type === selectedCombination.type) {
          return { ...combination, score: selectedCombination.calculateScore(diceValues) };
        } else {
          return { ...combination };
        }
      });

    setGameBoard((prevGameBoard) => {
      return prevGameBoard.map((player) => {
        if (player.id !== prevGameBoard.state.activePlayerId) return player;

        return {
          ...player,
          score: updatedPlayerScore
        };
      });
    });

    switchPlayer();
  }

  /* ----------------------------------------------------------- 
                              EFFECT 
-----------------------------------------------------------  */

  useEffect(() => {
    if (!gameBoard) {
      return
    }

    if (gameBoard.state.currentRound >= MAX_ROUNDS_PER_PLAYER) {

      setTimeout(() => {
        const diceValues = dices.map(dice => dice.value);
        const allowed = [];
        YATZY_COMBINATIONS.forEach((combination) => {
          if (combination.isValidCombination(diceValues) && isCombinationAvailableForPlayer(gameBoard.state.activePlayerId, gameBoard, combination.type)) {
            allowed.push(combination);

          }
        })

        setAllowedCombinations(allowed);
        setIsCombinationPickerOpen(true);
      }, 1000);
    }
  }, [dices]);

  /* ----------------------------------------------------------- 
                                ON RELOAD 
  -----------------------------------------------------------  
  useEffect(() => {
    oneReload()
  }, [])

  const oneReload = () => {
    console.log("reloaded")
    const loadedCurrentPlayState = localStorage.getItem('currentPlayState')
    console.log(loadedCurrentPlayState)
    setGameBoard(loadedCurrentPlayState);
  }
*/
  /* ----------------------------------------------------------- 
                                RENDER 
  -----------------------------------------------------------  */

  if (!gameBoard) {
    return <PlayerSetup onStartGame={handleStartGame} />;
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 bg-gray-600 px-4 py-6 sm:py-8">
      <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-white">Yatzy</h1>

      {/* ---- Player Cards ---- */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 w-full max-w-md md:max-w-none">
        {gameBoard.players.map((player) => (
          <div
            key={player.id}
            className={[
              "relative flex items-center",
              "flex-1 min-w-[80px] max-w-[140px] sm:min-w-[100px] sm:max-w-[180px]",
              "h-16",
              "px-3 sm:px-4 md:px-6",
              "rounded-xl shadow-lg transition-all duration-300",
              player.id === gameBoard.state.activePlayerId
                ? "bg-emerald-500 text-gray-900 ring-2 ring-emerald-300"
                : "text-white border border-dashed",
            ].join(" ")}
          >
            {player.id === gameBoard.state.activePlayerId && (
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-1 px-3">
                {Array.from({ length: gameBoard.state.currentRound }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 bg-emerald-900 rounded-full"
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
            isSelectionDisabled={gameBoard.state.currentRound === 0}
          />
        ))}
      </div>

      <button
        onClick={rollAll}
        className={`px-6 sm:px-8 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-700 cursor-pointer ${!(gameBoard.state.currentRound < MAX_ROUNDS_PER_PLAYER) ? "invisible" : ""}`}
      >
        {"Roll the dices!"}
      </button>

      <CombinationPicker onSelect={onCombinationSelect} isOpen={isCombinationPickerOpen} allowedCombinations={allowedCombinations} diceValues={dices.map(dice => dice.value)} />
      <Scoreboard gameBoard={gameBoard} isCombinationPickerOpen={isCombinationPickerOpen} />
    </div>
  );
}
