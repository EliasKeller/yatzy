"use client";

import { useEffect, useState } from "react";
import Dice from "./components/dice";
import { DEFAULT_DICES, INITIAL_SCORE_OF_PLAYER, MAX_ROUNDS_PER_PLAYER, YATZY_COMBINATIONS } from "@/utils/const";
import Scoreboard from "./components/scoreboard";
import CombinationPicker from "./components/combination-picker";
import PlayerSetup from "./components/player-setup";
import useLocalStorage from "./hooks/useLocalStorage";
import ResetMenu from "./components/reset-menu";
import { getNextActivePlayerId } from "@/utils/utils";
import { getWinnerIds } from "@/utils/scoreCalculations";
import PlayerCard from "./components/player-card";
import PlayerResult from "./components/player-result";

export default function Home() {
  /* ----------------------------------------------------------- 
                                STATES 
  -----------------------------------------------------------  */
  const [gameBoard, setGameBoard] = useLocalStorage("gameBoard", null);
  const [isDiceRolling, setIsDiceRolling] = useState(false);


  /* ----------------------------------------------------------- 
                                HELPERS 
  -----------------------------------------------------------  */
  const handleStartGame = (players) => {
    const initialGameBoard = {
      players: players.map(player => ({
        ...player,
        score: INITIAL_SCORE_OF_PLAYER,
        isTerminated: false,
        isWinner: false
      })),
      state: {
        activePlayerId: players[0].id,
        currentRound: 0,
        dices: DEFAULT_DICES,
        isCombinationPickerOpen: false,
      }

    }

    setGameBoard(initialGameBoard);
  }

  const rollAll = () => {

    if (gameBoard.state.currentRound >= MAX_ROUNDS_PER_PLAYER || isDiceRolling) {
      return;
    }

    setIsDiceRolling(true);

    const nextDices = gameBoard.state.dices.map((dice) => {
      if (dice.isSelected) return dice;

      return {
        ...dice,
        value: Math.floor(Math.random() * 6) + 1,
      };
    });

    setGameBoard((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        currentRound: prev.state.currentRound + 1,
        dices: nextDices,
      },
    }));

    setTimeout(() => {
      setIsDiceRolling(false);
    }, 700);
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

  const onCombinationSelect = (selectedCombination) => {
    // ------ Update Score -----
    const diceValues = gameBoard.state.dices.map(dice => dice.value);

    let updatedPlayers = gameBoard.players.map((player) => {
      if (player.id !== gameBoard.state.activePlayerId) {
        return player;
      }

      return {
        ...player,
        score: player.score.map(combination => {
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
        })
      };
    })

    // ----- Check if Player is Terminated -----
    const isCurrentPlayerTerminated = updatedPlayers.find(player => player.id === gameBoard.state.activePlayerId)
      .score.every(score => score.score !== undefined);

    updatedPlayers = updatedPlayers.map(player => {
      if (player.id === gameBoard.state.activePlayerId) {
        return {
          ...player,
          isTerminated: isCurrentPlayerTerminated
        }
      }
      return player;
    })


    // ------ Switch Player -----
    const nextPlayerId = getNextActivePlayerId(updatedPlayers, gameBoard.state.activePlayerId);

    // ----- Check if Game is Finished -----
    if (!nextPlayerId) {
      const winnerIds = getWinnerIds(updatedPlayers);
      updatedPlayers = updatedPlayers.map(player => {
        if (winnerIds.includes(player.id)) {
          return {
            ...player,
            isWinner: true
          }
        }
        return player;
      });
    }



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
        players: updatedPlayers
      };
    });
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
        isTerminated: false,
        isWinner: false,
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
    let updatedPlayers = gameBoard.players.map(player => {
      if (player.id === gameBoard.state.activePlayerId) {
        return {
          ...player,
          isTerminated: true,
          score: player.score.map(score => ({
            ...score,
            score: score.score === undefined ? null : score.score
          }))
        }
      }
      return player;
    })

    const nextPlayerId = getNextActivePlayerId(updatedPlayers, gameBoard.state.activePlayerId);

    if (!nextPlayerId) {
      const winnerIds = getWinnerIds(updatedPlayers);
      updatedPlayers = updatedPlayers.map(player => {
        if (winnerIds.includes(player.id)) {
          return {
            ...player,
            isWinner: true
          }
        }
        return player;
      });
    }

    setGameBoard((prevGameBoard) => {
      return {
        ...prevGameBoard,
        state: {
          ...prevGameBoard.state,
          activePlayerId: nextPlayerId,
          currentRound: 0,
          dices: cloneDices(DEFAULT_DICES),
          isCombinationPickerOpen: false,
        },
        players: updatedPlayers
      };
    });
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


  if (gameBoard.players.some(player => player.isWinner)) {

    return (
      <>
        <PlayerResult gameBoard={gameBoard} onRestartGame={handleRestartGame} onResetWhole={handleResetWhole} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 sm:gap-6 md:gap-8 bg-gray-600 px-4 py-6 sm:py-8">
      <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-white">Yatzy</h1>

      {/* ---- Player Cards ---- */}
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 w-full max-w-md md:max-w-none">
        {gameBoard.players.map((player) => (
          <PlayerCard key={player.id} player={player} gameBoard={gameBoard} />
        ))}
      </div>

      {/* ---- Dices ---- */}
      <div className="flex gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center max-w-xs sm:max-w-md md:max-w-none">
        {gameBoard.state.dices.map((dice, index) => (
          <Dice
            key={dice.id}
            id={dice.id}
            value={dice.value}
            isSelected={dice.isSelected}
            isRolling={isDiceRolling}
            isSelectionDisabled={gameBoard.state.currentRound == 0}
            onDiceSelect={onDiceSelect}
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
          disabled={isDiceRolling || gameBoard.state.currentRound === 0}
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
