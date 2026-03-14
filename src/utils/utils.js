import { getPlayerScore } from "./scoreCalculations";

const arraysEqual = (a, b) => {
    return a.length === b.length && a.every((value, index) => value === b[index]);
}

const isCombinationAvailableForPlayer = (playerId, gameBoard, combinationType) => {
    const playerScore = getPlayerScore(playerId, gameBoard);
    const scoreForType = playerScore.find(score => score.type === combinationType);

    return scoreForType.score === undefined
}



const getNextActivePlayerId = (players, activePlayerId) => {
  if (!players.length) return null;

  const currentIndex = players.findIndex(player => player.id === activePlayerId);
  if (currentIndex === -1) return null;

  for (let step = 1; step <= players.length; step++) {
    const nextIndex = (currentIndex + step) % players.length;
    const nextPlayer = players[nextIndex];

    if (!nextPlayer.isTerminated) {
      return nextPlayer.id;
    }
  }

  return null;
};



export {
    arraysEqual,
    isCombinationAvailableForPlayer,
    getNextActivePlayerId
}
