"use client";

import { useEffect, useState } from "react";
import Dice from "./components/dice";
import { DEFAULT_DICES, INITIAL_SCORE_OF_PLAYER, MAX_ROUNDS_PER_PLAYER, YATZY_COMBINATIONS } from "@/utils/const";
import Scoreboard from "./components/scoreboard";
import CombinationPicker from "./components/combinationPicker";
import PlayerSetup from "./components/player-setup";
import useLocalStorage from "./hooks/useLocalStorage";
import ResetMenu from "./components/reset-menu";

export default function Home() {
  /* ----------------------------------------------------------- 
                                STATES 
  -----------------------------------------------------------  */
  const [gameBoard, setGameBoard] = useLocalStorage("gameBoard", null);
  const [rollTrigger, setRollTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isDiceRolling, setIsDiceRolling] = useState(false);


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
        dices: DEFAULT_DICES,
        isCombinationPickerOpen: false
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
      setIsDiceRolling(true);
      setRollTrigger((rollCount) => rollCount + 1);
    }
  };

  const updateDiceValue = (diceIndex, diceValue) => {
    setGameBoard((prevGameBoard) => ({
      ...prevGameBoard,
      state: {
        ...prevGameBoard.state,
        dices: prevGameBoard.state.dices.map((dice, index) => (index === diceIndex ? { ...dice, value: diceValue } : dice))
      }
    }));
  };

  const cloneDices = (dices) => dices.map(dice => ({ ...dice }));

  const onDiceSelect = (diceId) => {
    setGameBoard((prevGameBoard) => ({
      ...prevGameBoard,
      state: {
        ...prevGameBoard.state,
        dices: prevGameBoard.state.dices.map(dice => dice.id === diceId ? { ...dice, isSelected: !dice.isSelected } : dice)
      }
    }));
  };

  const onRollingIsDone = () => {
    setIsDiceRolling(false);
  }

  const onCombinationSelect = (selectedCombination) => {

    const diceValues = gameBoard.state.dices.map(dice => dice.value);

    // ------ Update Score -----
    let updatedPlayerScore = gameBoard.players
      .find((player) => player.id === gameBoard.state.activePlayerId).score
      .map(combination => {
        if (combination.type === selectedCombination.type) {
          return {
            ...combination,
            score: selectedCombination.calculateScore(diceValues)
          };
        } else {
          return {
            ...combination
          };
        }
      });

    // ------ Switch Player -----
    const currentIndex = gameBoard.players.findIndex(player => player.id === gameBoard.state.activePlayerId);
    const nextPlayerId = gameBoard.players[(currentIndex + 1) % gameBoard.players.length].id;

    setGameBoard((prevGameBoard) => {
      return {
        ...prevGameBoard,
        state: {
          ...prevGameBoard.state,
          activePlayerId: nextPlayerId,
          currentRound: 0,
          dices: cloneDices(DEFAULT_DICES),
          isCombinationPickerOpen: false
        },
        players: prevGameBoard.players.map((player) => {
          if (player.id !== prevGameBoard.state.activePlayerId) {
            return player;
          }

          return {
            ...player,
            score: updatedPlayerScore
          };
        })
      };
    });



    setResetTrigger((resetCount) => resetCount + 1);
  }

  const finalizeTurn = () => {
    setGameBoard((prevGameBoard) => ({
      ...prevGameBoard,
      state: {
        ...prevGameBoard.state,
        isCombinationPickerOpen: true
      }
    }));

  }

  const handleRestartGame = () => {
    setGameBoard((prevGameBoard) => ({
      ...prevGameBoard,
      players: prevGameBoard.players.map(player => ({
        ...player,
        score: INITIAL_SCORE_OF_PLAYER
      })),
      state: {
        activePlayerId: prevGameBoard.players[0].id,
        currentRound: 0,
        dices: DEFAULT_DICES,
        isCombinationPickerOpen: false
      }
    }));
  }

  const handleResetWhole = () => {
    setGameBoard(null);
  }

  const handleTerminateForCurrentPlayer = () => {
    // TBD
    /*const currentIndex = gameBoard.players.findIndex(player => player.id === gameBoard.state.activePlayerId);
    const nextPlayerId = gameBoard.players[(currentIndex + 1) % gameBoard.players.length].id;

    setGameBoard((prevGameBoard) => {
      return {
        ...prevGameBoard,
        state: {
          ...prevGameBoard.state,
          activePlayerId: nextPlayerId,
          currentRound: 0,
          dices: cloneDices(DEFAULT_DICES),
          isCombinationPickerOpen: false
        },
        players: prevGameBoard.players.map((player) => {
          if (player.id !== prevGameBoard.state.activePlayerId) {
            return player;
          }

          return {
            ...player,
            isTerminated: true,
          };
        })
      };
    });*/
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
        finalizeTurn();
      }, 1500);
    }
  }, [gameBoard?.state?.currentRound]);

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
        {gameBoard.state.dices.map((dice, index) => (
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
            onRollingIsDone={onRollingIsDone}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <button
          onClick={rollAll}
          disabled={isDiceRolling}
          className={`w-48 px-6 sm:px-8 py-2.5 
              sm:py-3 text-base sm:text-lg font-semibold 
              rounded-lg bg-gray-800 text-white 
              border border-gray-700
              hover:bg-gray-700 cursor-pointer 
              ${!gameBoard.state.dices.some(dice => !dice.isSelected) || !(gameBoard.state.currentRound < MAX_ROUNDS_PER_PLAYER) || isDiceRolling ?
              "bg-transparent text-white border border-white border-dashed hover:bg-transparent" : ""}`}
        >
          {"Roll Dice"}
        </button>

        <button
          onClick={finalizeTurn}
          disabled={isDiceRolling}
          className={`w-48 px-6 sm:px-8 py-2.5 sm:py-3 
              text-base sm:text-lg font-semibold 
              rounded-lg bg-emerald-500 text-gray-900 
              border border-emerald-500
              text-bold hover:bg-emerald-600 cursor-pointer 
              ${!(gameBoard.state.currentRound > 0) || !(gameBoard.state.currentRound < MAX_ROUNDS_PER_PLAYER) || isDiceRolling ?
              "bg-transparent text-white border border-white border-dashed hover:bg-transparent cursor-default" : ""}`}
        >
          {"Select Score"}
        </button>
      </div>


      <CombinationPicker onSelect={onCombinationSelect} onTerminateForPlayer={handleTerminateForCurrentPlayer} isOpen={gameBoard.state.isCombinationPickerOpen} gameBoard={gameBoard} />
      <ResetMenu onRestartGame={handleRestartGame} onResetWhole={handleResetWhole} />
      <Scoreboard gameBoard={gameBoard} isCombinationPickerOpen={gameBoard.state.isCombinationPickerOpen} />
    </div>
  );
}
