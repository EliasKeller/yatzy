"use client";

import { useState } from "react";
import ConfirmModal from "./confirm-modal";
import { ArrowReset20Regular } from "@fluentui/react-icons";

export default function ResetMenu({ onRestartGame, onResetWhole }) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleRestartClick = () => {
    setIsOpen(false);
    setConfirmAction({
      title: "Restart Game",
      message: "Are you sure you want to restart the game? All points will be reset.",
      onConfirm: () => {
        onRestartGame();
        setConfirmAction(null);
      },
    });
  };

  const handleResetWholeClick = () => {
    setIsOpen(false);
    setConfirmAction({
      title: "Reset All",
      message: "Are you sure you want to reset everything? You will return to the player selection.",
      onConfirm: () => {
        onResetWhole();
        setConfirmAction(null);
      },
    });
  };

  return (
    <>
      {/* ---- Trigger Button ---- */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
                fixed top-5 right-5 z-[60]
                h-14 w-14 rounded-full
                bg-emerald-500 text-gray-900
                text-bold shadow-sm shadow-black/30
                hover:bg-emerald-600
                active:scale-95
                flex items-center justify-center
                cursor-pointer
              `}
        aria-label="Reset"
      >
        <ArrowReset20Regular className="h-6 w-6" />
      </button>

      {/* ---- Options Modal ---- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-sm w-full mx-4 rounded-xl bg-gray-800 border border-gray-700 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-xl font-bold text-emerald-400">
                Reset Game
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* ---- Options ---- */}
            <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
              <button
                onClick={handleRestartClick}
                className="w-full px-4 py-4 text-base font-semibold rounded-lg bg-gray-700 text-white hover:bg-emerald-900/50 hover:text-emerald-300 cursor-pointer transition-colors text-left"
              >
                <span className="block text-base font-semibold">Restart Game</span>
                <span className="block text-sm text-gray-400 font-normal mt-1">
                  Reset points, same players
                </span>
              </button>
              <button
                onClick={handleResetWholeClick}
                className="w-full px-4 py-4 text-base font-semibold rounded-lg bg-gray-700 text-white hover:bg-red-900/50 hover:text-red-300 cursor-pointer transition-colors text-left"
              >
                <span className="block text-base font-semibold">Reset All</span>
                <span className="block text-sm text-gray-400 font-normal mt-1">
                  Back to player selection
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Confirm Modal ---- */}
      <ConfirmModal
        isOpen={!!confirmAction}
        title={confirmAction?.title || ""}
        message={confirmAction?.message || ""}
        onConfirm={confirmAction?.onConfirm || (() => { })}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}
