"use client";

import { Trophy20Regular } from "@fluentui/react-icons";
import PlayerCard from "./player-card";
import Scoreboard from "./scoreboard";
import ResetMenu from "./reset-menu";

export default function PlayerResult({ gameBoard, onRestartGame, onResetWhole }) {

    const winners = gameBoard.players.filter(player => player.isWinner);
    const isTie = winners.length > 1;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-600 px-4 py-6 sm:py-8">
            <div className="mb-6 sm:mb-8">
                <Trophy20Regular className="h-24 w-24 text-yellow-400" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                Game Over!
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-4 sm:mb-6">
                {isTie ? "Tie between:" : "The winner is:"}
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                {winners.map((winner) => (
                    <PlayerCard key={winner.id} player={winner} gameBoard={gameBoard} />
                ))}
            </div>

            <Scoreboard gameBoard={gameBoard} isCombinationPickerOpen={gameBoard.state.isCombinationPickerOpen} />
            <ResetMenu onRestartGame={onRestartGame} onResetWhole={onResetWhole} />
        </div>
    );
}
