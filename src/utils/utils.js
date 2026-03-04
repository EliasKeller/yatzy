const arraysEqual = (a, b) => {
    return a.length === b.length && a.every((value, index) => value === b[index]);
}

const isCombinationAvailableForPlayer = (playerId, combinationType, scores) => {
    const playerScore = scores.find((score) => score.playerId === playerId)
    const scoreForType = playerScore.score.find(score => score.type === combinationType)

    return scoreForType.score === undefined
}

export {
    arraysEqual,
    isCombinationAvailableForPlayer
}
