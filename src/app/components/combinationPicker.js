"use client";

import { YATZY_COMBINATIONS } from "@/utils/const";

const DICE_DOTS = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
};

function DiceIcon({ value, size = 28 }) {
  const dotPositions = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
  };

  const dots = dotPositions[value] || [];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="2" y="2" width="96" height="96" rx="16" fill="#1f2937" stroke="#4b5563" strokeWidth="3" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="10" fill="#d1d5db" />
      ))}
    </svg>
  );
}

export default function CombinationPicker({ onSelect, isOpen = false, allowedCombinations = [] }) {
  const upperSection = YATZY_COMBINATIONS.filter((combination) => combination.section === "upper" && allowedCombinations.some(allowed => allowed.type === combination.type));
  const lowerSection = YATZY_COMBINATIONS.filter((combination) => combination.section === "lower" && allowedCombinations.some(allowed => allowed.type === combination.type));

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60"
      >
        <div
          className="relative w-full md:max-w-lg md:mx-4 max-h-[85vh] overflow-y-auto rounded-t-2xl md:rounded-xl bg-gray-800 border border-gray-700 text-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ---- Drag Handle (mobile) ---- */}
          <div className="flex justify-center pt-3 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-600" />
          </div>

          {/* ---- Header ---- */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h2 className="text-xl font-bold text-emerald-400">
              Choose a combination
            </h2>
          </div>

          {/* ---- Upper Section (Tile Grid) ---- */}
          {upperSection.length > 0 && (
            <div className="px-4 pb-2">
              <p className="pb-2 px-1 text-xs font-bold uppercase tracking-wider text-emerald-500">
                Upper Section
              </p>
              <div className="flex flex-col gap-2">
                {upperSection.map((combo) => (
                  <button
                    key={combo.type}
                    onClick={() => onSelect(combo)}
                    className="flex flex-row items-center justify-start gap-1.5 p-2 rounded-xl bg-gray-700/50 border border-gray-600/50 active:scale-95 active:bg-emerald-900/50 hover:bg-emerald-900/40 hover:border-emerald-700/50 transition-all cursor-pointer"
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

          {/* ---- Lower Section (Tile Grid) ---- */}
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
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-700/50 border border-gray-600/50 active:scale-95 active:bg-emerald-900/50 hover:bg-emerald-900/40 hover:border-emerald-700/50 transition-all cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-gray-300">
                      {combo.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
