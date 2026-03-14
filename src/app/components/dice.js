"use client";

import { useEffect, useState } from "react";

export default function Dice({
  id,
  value,
  isSelected,
  isRolling,
  onDiceSelect,
  isSelectionDisabled,
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isRolling) {
      setDisplayValue(value);
      return;
    }

    if (isSelected) {
      setDisplayValue(value);
      return;
    }

    const interval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
    }, 80);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayValue(value);
    }, 700);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isRolling, value, isSelected]);

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

  const positionMap = {
    "top-left": 0,
    "top-right": 2,
    "middle-left": 3,
    center: 4,
    "middle-right": 5,
    "bottom-left": 6,
    "bottom-right": 8,
  };

  const onSelect = () => {
    if (isSelectionDisabled || isRolling) {
      return;
    }
    onDiceSelect(id);
  };

  return (
    <div
      className={[
        "relative w-24 h-24 md:h-32 md:w-32 shrink-0 border-4 border-gray-800 rounded-lg shadow-lg",
        "transition-transform duration-200 transform-gpu",
        isRolling && !isSelected ? "animate-[roll_800ms_ease-in-out_infinite]" : "hover:scale-105",
        isSelected ? "bg-gray-800" : "bg-white",
      ].join(" ")}
      onClick={onSelect}
    >
      <div className="absolute inset-2 grid grid-cols-3 grid-rows-3 gap-1 place-items-center">
        {Array.from({ length: 9 }).map((_, index) => {
          const shouldShow = getDotPositions(displayValue).some(
            (pos) => positionMap[pos] === index
          );

          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 transform-gpu ${
                shouldShow
                  ? `${isSelected ? "bg-white" : "bg-gray-800"} scale-100`
                  : "bg-transparent scale-0"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}