"use client";

import { AddCircle20Regular, Checkmark20Regular, Delete20Regular, Edit12Regular } from "@fluentui/react-icons";
import { useState } from "react";

export default function PlayerSetup({ onStartGame }) {
    const [players, setPlayers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [error, setError] = useState("");

    const addPlayer = () => {
        const newId = Math.max(...players.map((p) => p.id), 0) + 1;
        setPlayers([...players, { id: newId, name: `Spieler ${newId}` }]);
        setError("");
    };

    const removePlayer = (id) => {
        setPlayers(players.filter((p) => p.id !== id));
    };

    const startEdit = (player) => {
        setEditingId(player.id);
        setEditValue(player.name);
    };

    const saveEdit = () => {
        if (editValue.trim()) {
            setPlayers(
                players.map((p) =>
                    p.id === editingId ? { ...p, name: editValue.trim() } : p
                )
            );
        }
        setEditingId(null);
        setEditValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            saveEdit();
        } else if (e.key === "Escape") {
            setEditingId(null);
            setEditValue("");
        }
    };

    const handleStartGame = () => {
        if (players.length >= 1) {
            onStartGame(players);
        } else {
            setError("Please add at least one player to start the game.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 bg-gray-600 px-4 py-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Yatzy
            </h1>

            <div className="w-full max-w-md">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-300 mb-4 text-center">
                    Set up the players
                </h2>

                {/* ---- Player List ---- */}
                <div className="flex flex-col gap-3">
                    {players.map((player, index) => (
                        <div
                            key={player.id}
                            className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700"
                        >
                            {/* Name or Edit Input */}
                            {editingId === player.id ? (
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={saveEdit}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    className="flex-1 bg-gray-700 text-white px-1.5 py-1.5 rounded-lg border border-emerald-500 outline-none text-sm sm:text-base"
                                    maxLength={20}
                                />
                            ) : (
                                <span
                                    className="flex-1 text-white px-1.5 font-medium truncate text-sm sm:text-base"
                                    onClick={() => startEdit(player)}>
                                    {player.name}
                                </span>
                            )}

                            {/* Edit Button */}
                            {editingId !== player.id ? (
                                <button
                                    onClick={() => startEdit(player)}
                                    className="p-2 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
                                    aria-label="Bearbeiten"
                                >
                                    <Edit12Regular className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        saveEdit();
                                    }}
                                    className="p-2 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
                                    aria-label="Speichern"
                                >
                                    <Checkmark20Regular className="w-4 h-4" />
                                </button>
                            )}

                            {/* Remove Button */}
                            <button
                                onClick={() => removePlayer(player.id)}
                                className={`p-2 transition-colors cursor-pointer text-gray-400 hover:text-red-400`}
                                aria-label="Remove"
                            >
                                <Delete20Regular className="h-4 w-4 hover:text-red-400" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* ---- Add Player Button ---- */}
                <button
                    onClick={addPlayer}
                    className={`w-full mt-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-2 border-gray-500 text-gray-400 hover:border-emerald-500 hover:text-emerald-400`}
                >
                    <AddCircle20Regular className="w-4 h-4" />
                    <span className="font-medium">Add Player</span>
                </button>
            </div>

            {/* ---- Start Game Button ---- */}
            {error && <span className="text-red-500">{error}</span>}

            <button
                onClick={handleStartGame}
                className="px-10 py-4 text-lg sm:text-xl font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
            >
                Start Game
            </button>
        </div>
    );
}
