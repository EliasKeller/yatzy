"use client";

export default function PlayerCard({ player, gameBoard }) {

  const getBackgroundColor = () => {
    if (player.isWinner) {
      return "bg-amber-500/30 text-yellow-400 border border-dashed";
    } else if (player.id === gameBoard.state.activePlayerId) {
      return "bg-emerald-500 text-gray-900 ring-2 ring-emerald-300";
    } else if (player.isTerminated) {
      return "bg-amber-500/30 text-white line-through border border-dashed";
    } else {
      return "text-white border border-dashed";
    }
  }

  return (
    <div
      key={player.id}
      className={[
        "relative flex items-center",
        "flex-1 min-w-[80px] max-w-[140px] sm:min-w-[100px] sm:max-w-[180px]",
        "h-16",
        "px-3 sm:px-4 md:px-6",
        "rounded-xl shadow-lg transition-all duration-300",
        getBackgroundColor(),
      ].join(" ")}
    >
      {player.id === gameBoard.state.activePlayerId && (
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-1 px-3">
          {Array.from({ length: gameBoard.state.currentRound }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 bg-emerald-900 rounded-full"
            />
          ))}
        </div>
      )}

      <h3 className="text-sm sm:text-lg md:text-xl font-bold truncate">
        {player.name}
      </h3>
    </div>
  );
}