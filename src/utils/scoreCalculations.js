import { BONUS_MIN_NEEDED_POINTS, BONUS_REWARD, COMBINATIONS_LOWER_SECTION, COMBINATIONS_UPPER_SECTION } from "./const";


const getPlayerScore = (playerId, gameBoard) => {
    return gameBoard.players.find((player) => player.id === playerId).score;
}

const getScoreForPlayerByType = (playerId, type, gameBoard) => {
    const playerScore = getPlayerScore(playerId, gameBoard);
    const scoreForType = playerScore.find(score => score.type === type).score

    if (scoreForType) {
        return scoreForType
    } else if (scoreForType === null) {
        return "X"
    }
    return "-"
}

const getSumOfUpperSectionForPlayer = (playerId, gameBoard) => {
    const playerScore = getPlayerScore(playerId, gameBoard);
    const playerScoreUpperSection = playerScore
        .filter(t => COMBINATIONS_UPPER_SECTION.map(s => s.type).includes(t.type))
        .map(s => s.score).filter(t => t !== undefined && t !== null)

    const sum = playerScoreUpperSection.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
    );

    return sum;
}

const calculateBonus = (playerId, gameBoard) => {
    const playerScore = getPlayerScore(playerId, gameBoard);
    const playerScoreUpperSection = playerScore.filter(t => COMBINATIONS_UPPER_SECTION.map(s => s.type).includes(t.type))
    const isUpperSectionFullyFilledOut = !playerScoreUpperSection.some(score => score.score === undefined)

    if (!isUpperSectionFullyFilledOut) {
        return "-"
    }

    const sum = getSumOfUpperSectionForPlayer(playerId, gameBoard)

    if (sum >= BONUS_MIN_NEEDED_POINTS
    ) {
        return BONUS_REWARD
    }

    return "X"
}

const getTotalScoreForPlayer = (playerId, gameBoard) => {
    const sumUpperSection = getSumOfUpperSectionForPlayer(playerId, gameBoard)

    const bonus = calculateBonus(playerId, gameBoard);

    const playerScore = getPlayerScore(playerId, gameBoard)
    const playerScoreLowerSection = playerScore
        .filter(t => COMBINATIONS_LOWER_SECTION.map(s => s.type).includes(t.type))
        .map(s => s.score).filter(t => t)
    const sumLowerSection = playerScoreLowerSection.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
    );

    return sumUpperSection + sumLowerSection + (bonus === BONUS_REWARD ? BONUS_REWARD : 0);
}

export {
    getPlayerScore,
    getScoreForPlayerByType,
    getSumOfUpperSectionForPlayer,
    calculateBonus,
    getTotalScoreForPlayer
}

