"use client";

import { useState } from "react";

export default function Dice() {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalNumber = Math.floor(Math.random() * 6) + 1;
        setCurrentNumber(finalNumber);
        setIsRolling(false);
      }
    }, 100);
  };

  const getDotPositions = (number) => {
    const positions = {
      1: ["center"],
      2: ["top-left", "bottom-right"],
      3: ["top-left", "center", "bottom-right"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "center", "bottom-left", "bottom-right"],
      6: ["top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right"],
    };
    return positions[number] || [];
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Würfel */}
      <div
        className={[
          "relative w-32 h-32 shrink-0 bg-white border-4 border-gray-800 rounded-lg shadow-lg",
          "transition-transform duration-200 transform-gpu",
          // eigene, sanfte „Roll“-Animation statt bounce:
          isRolling ? "animate-[roll_800ms_ease-in-out_infinite]" : "hover:scale-105"
        ].join(" ")}
      >
        <div className="absolute inset-2 grid grid-cols-3 grid-rows-3 gap-1">
          {Array.from({ length: 9 }).map((_, index) => {
            const positions = getDotPositions(currentNumber);
            const positionMap = {
              "top-left": 0,
              "top-right": 2,
              "middle-left": 3,
              center: 4,
              "middle-right": 5,
              "bottom-left": 6,
              "bottom-right": 8,
            };
            const shouldShow = positions.some((pos) => positionMap[pos] === index);

            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 transform-gpu align-center ${shouldShow ? "bg-gray-800 scale-100" : "bg-transparent scale-0"}`}
              />
            );
          })}
        </div>
      </div>

      {/* Würfel Button */}
      <button
        onClick={rollDice}
        disabled={isRolling}
        className="px-8 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRolling ? "Würfelt..." : "Würfeln!"}
      </button>

      {/* Ergebnis */}
      <div className="text-center">
        <p className="text-lg text-gray-500 mb-2">Ergebnis:</p>
        <p className="text-6xl font-bold text-blue-600">{currentNumber}</p>
      </div>
    </div>
  );
}
