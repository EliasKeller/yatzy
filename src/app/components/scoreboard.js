"use client";

import { useState } from "react";
import { BONUS_MIN_NEEDED_POINTS, BONUS_REWARD, YATZY_COMBINATIONS } from "@/utils/const";

export default function Scoreboard({ players, currentScore = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const upperSection = YATZY_COMBINATIONS.filter((c) => c.section === "upper");
  const lowerSection = YATZY_COMBINATIONS.filter((c) => c.section === "lower");

const getScorForPlayerByType = (playerId, type) => {
  const playerScore = currentScore.find((socre) => socre.playerId === playerId)
  const scoreForType = playerScore.score.find(score => score.type === type).score
  
  if (scoreForType){
    return scoreForType
  } else if (scoreForType === null){
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
        onClick={() => setIsOpen(true)}
        className="px-8 py-3 text-lg font-semibold rounded-lg bg-gray-800 text-white hover:bg-gray-700 cursor-pointer"
      >
        Scoreboard
      </button>

      {/* ---- Modal Backdrop + Content ---- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-xl bg-gray-800 border border-gray-700 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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
                          {getScorForPlayerByType(player.id, combo.type)}
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
                          {getScorForPlayerByType(player.id, combo.type)}
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
          </div>
        </div>
      )}
    </>
  );
}
