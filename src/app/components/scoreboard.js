"use client";

import { useState } from "react";
import { BONUS_MIN_NEEDED_POINTS, BONUS_REWARD, YATZY_COMBINATIONS } from "@/utils/const";
import { AppsListDetail20Regular } from "@fluentui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

export default function Scoreboard({ players, currentScore = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const upperSection = YATZY_COMBINATIONS.filter((c) => c.section === "upper");
  const lowerSection = YATZY_COMBINATIONS.filter((c) => c.section === "lower");

  const getScoreForPlayerByType = (playerId, type) => {
    const playerScore = currentScore.find((socre) => socre.playerId === playerId)
    const scoreForType = playerScore.score.find(score => score.type === type).score

    if (scoreForType) {
      return scoreForType
    } else if (scoreForType === null) {
      return "X"
    }
    return "-"
  }

  const getSumOfUpperSectionForPlayer = (playerId) => {
    const playerScore = currentScore.find((socre) => socre.playerId === playerId).score
    const playerScoreUpperSection = playerScore.filter(t => upperSection.map(s => s.type).includes(t.type)).map(s => s.score).filter(t => t)
    const sum = playerScoreUpperSection.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    return sum;
  }

  const calculateBonus = (playerId) => {
    const playerScore = currentScore.find((socre) => socre.playerId === playerId).score
    const playerScoreUpperSection = playerScore.filter(t => upperSection.map(s => s.type).includes(t.type))
    const isUpperSectionFullyFilledOut = !playerScoreUpperSection.some(score => score.score === undefined)

    if (!isUpperSectionFullyFilledOut) {
      return "-"
    }

    const sum = getSumOfUpperSectionForPlayer(playerId)

    if (sum >= BONUS_MIN_NEEDED_POINTS) {
      return BONUS_REWARD
    }

    return "X"
  }

  const getSumOfLowerSectionForPlayer = (playerId) => {
    const sumUpperSection = getSumOfUpperSectionForPlayer(playerId)

    const playerScore = currentScore.find((socre) => socre.playerId === playerId).score
    const playerScoreLowerSection = playerScore.filter(t => lowerSection.map(s => s.type).includes(t.type)).map(s => s.score).filter(t => t)
    const sumLowerSection = playerScoreLowerSection.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );

    return sumUpperSection + sumLowerSection;
  }

  return (
    <>
      {/* ---- Trigger Button ---- */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed bottom-5 right-5 z-[60]
          h-14 w-14 rounded-full
          bg-emerald-500 text-white
          shadow-xl shadow-black/30
          hover:bg-emerald-600
          active:scale-95
          flex items-center justify-center
          cursor-pointer
        "
        aria-label="Open scoreboard"
      >
        <AppsListDetail20Regular className="h-6 w-6" />
      </button>

      {/* ---- Modal Backdrop + Content ---- */}
      <AnimatePresence>
        {isOpen && (

          <motion.div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60"
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
                      {players.map((player) => (
                        <th
                          key={player.id}
                          className="py-2 px-3 text-center font-semibold border-b border-gray-700 text-emerald-300 min-w-20"
                        >
                          {player.name}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* ---- Oberer Bereich ---- */}
                    {upperSection.map((combo) => (
                      <tr
                        key={combo.type}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-2 px-3 text-gray-300 font-medium">
                          {combo.label}
                        </td>
                        {players.map((player) => (
                          <td
                            key={player.id}
                            className="py-2 px-3 text-center text-gray-500"
                          >
                            {getScoreForPlayerByType(player.id, combo.type)}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* ---- Summe oben ---- */}
                    <tr className="border-b border-gray-700/50 bg-emerald-900/20">
                      <td className="py-2 px-3 text-emerald-300 font-semibold">
                        Summe oben
                      </td>
                      {players.map((player) => (
                        <td
                          key={player.id}
                          className="py-2 px-3 text-center font-semibold text-emerald-400"
                        >
                          {getSumOfUpperSectionForPlayer(player.id)}
                        </td>
                      ))}
                    </tr>

                    {/* ---- Bonus ---- */}
                    <tr className="border-b border-gray-700/50 bg-emerald-900/20">
                      <td className="py-2 px-3 text-emerald-300 font-semibold">
                        {"Bonus (≥ 63)"}
                      </td>
                      {players.map((player) => (
                        <td
                          key={player.id}
                          className="py-2 px-3 text-center font-semibold text-gray-500"
                        >
                          {calculateBonus(player.id)}
                        </td>
                      ))}
                    </tr>

                    {/* ---- Unterer Bereich ---- */}
                    {lowerSection.map((combo) => (
                      <tr
                        key={combo.type}
                        className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-2 px-3 text-gray-300 font-medium">
                          {combo.label}
                        </td>
                        {players.map((player) => (
                          <td
                            key={player.id}
                            className="py-2 px-3 text-center text-gray-500"
                          >
                            {getScoreForPlayerByType(player.id, combo.type)}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* ---- Gesamt ---- */}
                    <tr className="border-t-2 border-emerald-800 bg-emerald-900/20">
                      <td className="py-3 px-3 text-emerald-300 font-bold text-base">
                        Gesamt
                      </td>
                      {players.map((player) => (
                        <td
                          key={player.id}
                          className="py-3 px-3 text-center font-bold text-emerald-300 text-base"
                        >
                          {getSumOfLowerSectionForPlayer(player.id)}
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
