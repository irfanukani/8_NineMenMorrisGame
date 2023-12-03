const adjacents = [
  [1, 9],
  [0, 2, 4],
  [1, 14],
  [4, 10],
  [1, 3, 5, 7],
  [4, 13],
  [7, 11],
  [4, 6, 8],
  [7, 12],
  [0, 10, 21],
  [3, 9, 11, 18],
  [6, 10, 15],
  [8, 13, 17],
  [5, 12, 14, 20],
  [2, 13, 23],
  [11, 16],
  [15, 17, 19],
  [12, 16],
  [10, 19],
  [16, 18, 20, 22],
  [13, 19],
  [9, 22],
  [19, 21, 23],
  [14, 22],
]

const onlyThreePiecesInBoard = (board, turn) =>
  board.filter((i) => i === turn).length === 3

/** Function to determine if it's the Valid Move or not
 * @param {Array} gameBoard - current State of game board
 * @param {Object} moveInfo
 *  @param {string} moveInfo.moveType - either [setup , slide, capture]
 *  @param {Array} moveInfo.indices - [Array of indices]
 */
const isValidMove = (game, moveInfo) => {
  // eslint-disable-next-line no-console
  const { boardState, turn } = game
  const gameBoard = boardState
  try {
    switch (moveInfo.moveType) {
      case 'setup':
        return gameBoard.at(moveInfo.indices.at(0)) === 0
      case 'slide':
        if (
          adjacents[moveInfo.indices.at(0)].includes(moveInfo.indices.at(1)) ||
          onlyThreePiecesInBoard(boardState, turn)
        )
          return gameBoard.at(moveInfo.indices.at(1)) === 0
        return false
      case 'capture':
        // let newMoveInfo = moveInfo;
        // newMoveInfo.moveType = 'capture';
        return (
          gameBoard.at(moveInfo.indices.at(0)) !== turn &&
          gameBoard.at(moveInfo.indices.at(0)) !== 0 &&
          isValidCapture(game, moveInfo)
        )
      default:
        return false
    }
  } catch (error) {
    return false
  }
}

function isValidCapture(game, moveInfo){
  const { boardState, turn } = game
  const trios = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
    [12, 13, 14],
    [15, 16, 17],
    [18, 19, 20],
    [21, 22, 23],
    [0, 9, 21],
    [3, 10, 18],
    [6, 11, 15],
    [1, 4, 7],
    [16, 19, 22],
    [8, 12, 17],
    [5, 13, 20],
    [2, 14, 23],
  ]

  if(specialCase(game, moveInfo).length === 0) return true
  const other = (turn=='host'?'guest':'host')
  
  for(let i=0; i<trios.length; i++){
    let count=0;
    for(let j=0; j<3; j++){
      if(boardState[trios[i][j]] == other) count++;
    }
    if(count>0 && count<3) return false;  
  }
  return true;
}

/** Function to register a move
 * @param {Object} gameInfo - current State of game
 *  @param {number} gameInfo.turn - current turn indicator
 *  @param {Array} gameInfo.gameBoard - current board status
 * @param {Object} moveInfo
 *  @param {string} moveInfo.moveType - either [setup , slide]
 *  @param {Array} moveInfo.indices - [Array of indices]
 */
const registerMove = (gameInfo, moveInfo) => {
  try {
    const updatedGameInfo = { ...gameInfo } // Create a shallow copy of gameInfo

    switch (moveInfo.moveType) {
      case 'setup':
        updatedGameInfo.boardState[moveInfo.indices[0]] = gameInfo.turn
        break
      case 'capture':
        updatedGameInfo.boardState[moveInfo.indices[0]] = 0
        break
      case 'slide':
        updatedGameInfo.boardState[moveInfo.indices[1]] = gameInfo.turn
        updatedGameInfo.boardState[moveInfo.indices[0]] = 0
        break
      default:
        break
    }

    return updatedGameInfo.boardState
  } catch (error) {
    return gameInfo.boardState
  }
}

/**
 * @param {Object} gameInfo - current State of game
 *  @param {Array} gameInfo.gameBoard - current board status
 */
const isSpecial = (gameBoard, index1, index2, index3, moveInfo) => {
  if (moveInfo.moveType === 'setup' || moveInfo.moveType === 'capture') {
    return (
      gameBoard[index1] !== 0 &&
      gameBoard[index1] === gameBoard[index2] &&
      gameBoard[index2] === gameBoard[index3] &&
      (index1 === moveInfo.indices[0] ||
        index2 === moveInfo.indices[0] ||
        index3 === moveInfo.indices[0])
    )
  }
  if (moveInfo.moveType === 'slide') {
    return (
      gameBoard[index1] !== 0 &&
      gameBoard[index1] === gameBoard[index2] &&
      gameBoard[index2] === gameBoard[index3] &&
      (index1 === moveInfo.indices[1] ||
        index2 === moveInfo.indices[1] ||
        index3 === moveInfo.indices[1])
    )
  }
  return false
}

/**
 *
 * @param {Object} gameInfo
 *  @param {Array} gameInfo.boardState
 * @param {Object} moveInfo
 *  @param {String} moveInfo.moveType
 *  @param {Array} moveInfo.indices
 * @returns
 */
const specialCase = (gameInfo, moveInfo) => {
  const { boardState } = gameInfo
  const trios = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
    [12, 13, 14],
    [15, 16, 17],
    [18, 19, 20],
    [21, 22, 23],
    [0, 9, 21],
    [3, 10, 18],
    [6, 11, 15],
    [1, 4, 7],
    [16, 19, 22],
    [8, 12, 17],
    [5, 13, 20],
    [2, 14, 23],
  ]
  const resultTrio =
    trios.find((trio) => isSpecial(boardState, ...trio, moveInfo)) || []
  // eslint-disable-next-line no-console
  // console.log(resultTrio)
  // if(resultTrio.length) resultTrio;
  if (moveInfo.moveType === 'setup' || moveInfo.moveType === 'capture') {
    if (resultTrio.includes(moveInfo.indices[0])) return resultTrio
  } else if (moveInfo.moveType === 'slide') {
    if (resultTrio.includes(moveInfo.indices[1])) return resultTrio
  }
  return []
}

// check if no valid move exists!!
const getWinnerIfGameOver = (gameInfo) => {
  const { boardState } = gameInfo
  const checkersHost = boardState.filter((i) => i === 'host')
  const checkersGuest = boardState.filter((i) => i === 'guest')

  if (checkersGuest.length <= 2) {
    return 'host'
  }
  if (checkersHost.length <= 2) {
    return 'guest'
  }
  return null
}

module.exports = { isValidMove, registerMove, specialCase, getWinnerIfGameOver }
