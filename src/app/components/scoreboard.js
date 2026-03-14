"use client";

import { useState } from "react";
import { COMBINATIONS_LOWER_SECTION, COMBINATIONS_UPPER_SECTION } from "@/utils/const";
import { AppsListDetail20Regular, Trophy20Regular } from "@fluentui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { getScoreForPlayerByType, getSumOfUpperSectionForPlayer, calculateBonus, getTotalScoreForPlayer } from "@/utils/scoreCalculations";

export default function Scoreboard({ gameBoard, isCombinationPickerOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ---- Trigger Button ---- */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-5 right-5 z-[60]
          h-14 w-14 rounded-full
          bg-emerald-500 text-gray-900
          text-bold shadow-sm shadow-black/30
          hover:bg-emerald-600
          active:scale-95
          flex items-center justify-center
          cursor-pointer
        `}
        aria-label="Open scoreboard"
      >
        <AppsListDetail20Regular className="h-6.5 w-6.5" />
      </button>

      {/* ---- Modal Backdrop + Content ---- */}
      <AnimatePresence>
        {isOpen && (

          <motion.div
            className={`fixed inset-0 z-50 flex items-end md:items-center justify-center ${isCombinationPickerOpen ? "" : "bg-black/60"
              }`}
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full md:max-w-lg md:mx-4 max-h-[85vh] overflow-y-auto rounded-t-2xl md:rounded-xl bg-gray-800 border border-gray-700 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.25 }}
              onDragEnd={(_, info) => {
                const shouldClose = info.offset.y > 120 || info.velocity.y > 700;
                if (shouldClose) {
                  setIsOpen(false);
                }
              }}
            >
              <div className="flex justify-center pt-3 md:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-600" />
              </div>

              {/* ---- Header ---- */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <h2 className="text-2xl font-bold text-emerald-400">
                  Scoreboard
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* ---- Table ---- */}
              <div className="overflow-x-auto px-4 pb-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-3 text-gray-400 font-medium border-b border-gray-700 w-40">
                      </th>
                      {gameBoard.players.map((player) => (
                        <th
                          key={player.id}
                          className={`py-2 px-3 text-center 
                            font-semibold border-b border-gray-700 
                            text-emerald-300 min-w-20 max-w-[140px] truncate
                            ${gameBoard.state.activePlayerId === player.id ? "underline underline-offset-4" : ""}`}
                        >
                          {player.name}
                          {player.isWinner && (
                            <Trophy20Regular className="inline-block ml-1 mb-0.5 text-yellow-400" />
                          )}

                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* ---- UPPER SECTION ---- */}
                    {COMBINATIONS_UPPER_SECTION.map((combo) => (
                      <tr
                        key={combo.type}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-2 px-3 text-gray-300 font-bold">
                          {combo.label}
                        </td>
                        {gameBoard.players.map((player) => (
                          <td
                            key={player.id}
                            className="py-2 px-3 text-center text-gray-300"
                          >
                            {getScoreForPlayerByType(player.id, combo.type, gameBoard)}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* ---- Summe oben ---- */}
                    <tr className="border-b border-gray-700/50 bg-emerald-900/20">
                      <td className="py-2 px-3 text-emerald-300 font-semibold">
                        Summe oben
                      </td>
                      {gameBoard.players.map((player) => (
                        <td
                          key={player.id}
                          className="py-2 px-3 text-center font-semibold text-emerald-400"
                        >
                          {getSumOfUpperSectionForPlayer(player.id, gameBoard)}
                        </td>
                      ))}
                    </tr>

                    {/* ---- Bonus ---- */}
                    <tr className="border-b border-gray-700/50 bg-emerald-900/20">
                      <td className="py-2 px-3 text-emerald-300 font-semibold">
                        {"Bonus (≥ 63)"}
                      </td>
                      {gameBoard.players.map((player) => (
                        <td
                          key={player.id}
                          className="py-2 px-3 text-center font-semibold text-gray-300"
                        >
                          {calculateBonus(player.id, gameBoard)}
                        </td>
                      ))}
                    </tr>

                    {/* ---- LOWER SECTION ---- */}
                    {COMBINATIONS_LOWER_SECTION.map((combo) => (
                      <tr
                        key={combo.type}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-2 px-3 text-gray-300 font-bold">
                          {combo.label}
                        </td>
                        {gameBoard.players.map((player) => (
                          <td
                            key={player.id}
                            className="py-2 px-3 text-center text-gray-300"
                          >
                            {getScoreForPlayerByType(player.id, combo.type, gameBoard)}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* ---- Gesamt ---- */}
                    <tr className="border-t-2 border-emerald-800 bg-emerald-900/20">
                      <td className="py-3 px-3 text-emerald-300 font-bold text-base">
                        Gesamt
                      </td>
                      {gameBoard.players.map((player) => (
                        <td
                          key={player.id}
                          className="py-3 px-3 text-center font-bold text-emerald-300 text-base"
                        >
                          {getTotalScoreForPlayer(player.id, gameBoard)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
