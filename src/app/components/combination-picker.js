"use client";

import { useEffect, useRef, useState } from "react";
import { DICE_DOTS, YATZY_COMBINATIONS } from "@/utils/const";
import { AnimatePresence, motion } from "framer-motion";
import { isCombinationAvailableForPlayer } from "@/utils/utils";
import DiceIcon from "./diceIcon";

export default function CombinationPicker({ onSelect, onTerminateForPlayer, isOpen = false, gameBoard = null }) {
  const [showHint, setShowHint] = useState(false);
  const [allowedCombinations, setAllowedCombinations] = useState([]);
  const hintTimeoutRef = useRef(null);

  const upperSection = YATZY_COMBINATIONS.filter(
    (combination) =>
      combination.section === "upper" &&
      allowedCombinations?.some((allowed) => allowed.type === combination.type)
  );

  const lowerSection = YATZY_COMBINATIONS.filter(
    (combination) =>
      combination.section === "lower" &&
      allowedCombinations?.some((allowed) => allowed.type === combination.type)
  );

  const showSelectHint = () => {
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }

    setShowHint(true);

    hintTimeoutRef.current = setTimeout(() => {
      setShowHint(false);
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gameBoard) {
      return
    }

    const diceValues = gameBoard.state.dices.map(dice => dice.value);
    const allowed = [];
    YATZY_COMBINATIONS.forEach((combination) => {
      if (combination.isValidCombination(diceValues) && isCombinationAvailableForPlayer(gameBoard.state.activePlayerId, gameBoard, combination.type)) {
        allowed.push(combination);

      }
    })

    setAllowedCombinations(allowed.length > 0 ? allowed : null);
  }, [gameBoard]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full md:max-w-lg md:mx-4 flex justify-center">
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-gray-200 shadow-lg"
                >
                  Please select a combination
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-2xl md:rounded-xl bg-gray-800 border border-gray-700 text-white shadow-2xl pb-[50px] md:pb-0"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0, x: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.25 }}
              onDragEnd={(_, info) => {
                const triedToClose =
                  info.offset.y > 120 || info.velocity.y > 700;

                if (triedToClose) {
                  showSelectHint();
                }
              }}
            >
              <div className="flex justify-center pt-3 md:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-600" />
              </div>



              <div
                className="flex flex-row items-center justify-center gap-1.5 pt-4"
              >
                {gameBoard.state.dices.map((dice, index) => (
                  <DiceIcon key={dice.id} value={dice.value} size={32} />
                ))}
              </div>

              {allowedCombinations === null ? (
                <div className="flex flex-col gap-5 py-5 items-center justify-center">
                  <p className="text-gray-400">No valid combinations available</p>
                  <button
                    onClick={onTerminateForPlayer}
                    className="flex-1 px-4 py-3 text-base font-semibold rounded-lg bg-red-500/50 text-red-500 text-white hover:bg-red-700/50 cursor-pointer transition-colors"
                  >
                    Terminate Your Game
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-5 pt-4 pb-2">
                    <h2 className="text-xl font-bold text-emerald-400">
                      Choose a combination
                    </h2>
                  </div>

                  {upperSection.length > 0 && (
                    <div className="px-4 pt-2 pb-2">
                      <p className="pb-2 px-1 text-xs font-bold uppercase tracking-wider text-emerald-500">
                        Upper Section
                      </p>
                      <div className="flex flex-col gap-2">
                        {upperSection.map((combo) => (
                          <button
                            key={combo.type}
                            onClick={() => onSelect(combo)}
                            className="flex flex-row items-center justify-start gap-1.5 rounded-xl border border-gray-600/50 bg-gray-700/50 p-2 transition-all cursor-pointer hover:bg-emerald-900/40 hover:border-emerald-700/50 active:scale-95 active:bg-emerald-900/50"
                          >
                            <DiceIcon value={DICE_DOTS[combo.type]} size={32} />
                            <span className="text-xs font-semibold text-gray-300">
                              {combo.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {lowerSection.length > 0 && (
                    <div className="px-4 pt-2 pb-5">
                      <p className="pb-2 px-1 text-xs font-bold uppercase tracking-wider text-emerald-500">
                        Lower Section
                      </p>
                      <div className="flex flex-col gap-2">
                        {lowerSection.map((combo) => (
                          <button
                            key={combo.type}
                            onClick={() => onSelect(combo)}
                            className="flex items-center gap-3 rounded-xl border border-gray-600/50 bg-gray-700/50 p-3.5 transition-all cursor-pointer hover:bg-emerald-900/40 hover:border-emerald-700/50 active:scale-95 active:bg-emerald-900/50"
                          >
                            <span className="text-sm font-semibold text-gray-300">
                              {combo.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}


            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}