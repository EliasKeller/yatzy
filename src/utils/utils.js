const arraysEqual = (a, b) => {
    return a.length === b.length && a.every((value, index) => value === b[index]);
}

const isCombinationAvailableForPlayer = (playerId, gameBoard, combinationType) => {
    const playerScore = getPlayerScore(playerId, gameBoard);
    const scoreForType = playerScore.find(score => score.type === combinationType);

    return scoreForType.score === undefined
}

const getPlayerScore = (playerId, gameBoard) => {
    return gameBoard.find((player) => player.id === playerId).score;
}

export {
    arraysEqual,
    isCombinationAvailableForPlayer,
    getPlayerScore
}
