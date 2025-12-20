"use client";

import { useEffect, useState } from "react";

export default function Dice({ index, initValue, initIsSelected, rollTrigger, resetTrigger, onValueChange }) {
  const [currentValue, setCurrentValue] = useState(initValue);
  const [isRolling, setIsRolling] = useState(false);
  const [isSelected, setIsSelected] = useState(initIsSelected);


  useEffect(() => {
    setCurrentValue(initValue);
    setIsSelected(initIsSelected);
  }, [resetTrigger, initValue, initIsSelected]);

  useEffect(() => {
    console.log("--------- (DICE " + id + ") rollTrigger received (" + rollTrigger + ") ---------");

    if (rollTrigger === 0) {
      return;
    }

    setIsRolling(true);
    let rollCount = 0;

    const rollInterval = setInterval(() => {
      if (isSelected){
        return;
      } 
      setCurrentValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const foundValue = Math.floor(Math.random() * 6) + 1;
        setCurrentValue(foundValue);
        onValueChange(index, foundValue);
        setIsRolling(false);
      }
    }, 100);

    return () => clearInterval(rollInterval);
  }, [rollTrigger]);

  
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

  return (
    <div
      className={[
        "relative w-32 h-32 shrink-0  border-4 border-gray-800 rounded-lg shadow-lg",
        "transition-transform duration-200 transform-gpu",
        isRolling ? "animate-[roll_800ms_ease-in-out_infinite]" : "hover:scale-105",
        isSelected ? "bg-gray-800" : "bg-white",
      ].join(" ")}
      onClick={() => onClick(id)}
    >
      <div className="absolute inset-2 grid grid-cols-3 grid-rows-3 gap-1 place-items-center">
        {Array.from({ length: 9 }).map((_, index) => {
          const shouldShow = getDotPositions(currentValue).some(
            (pos) => positionMap[pos] === index
          );

          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 transform-gpu ${
                shouldShow ? `${isSelected ? "bg-white" : "bg-gray-800"} scale-100` : `bg-transparent scale-0`
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
