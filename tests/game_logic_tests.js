const { expect } = require('chai')
const { isValidMove, registerMove } = require('../game/index')

describe('Valid Move Checker', () => {
  it('should return true for a valid setup move', (done) => {
    const gameBoard = new Array(24).fill(0)
    const moveInfo = {
      moveType: 'setup',
      indices: [23],
    }
    const result = isValidMove(gameBoard, moveInfo)
    expect(result).to.be.equal(true)
    done()
  })

  it('should return false for an invalid setup move', (done) => {
    const gameBoard = new Array(24).fill(0)
    gameBoard[1] = 1
    const moveInfo = {
      moveType: 'setup',
      indices: [1],
    }
    const result = isValidMove(gameBoard, moveInfo)
    expect(result).to.be.equal(false)
    done()
  })

  it('should return true for valid slide move', (done) => {
    const gameBoard = new Array(24).fill(0)
    const moveInfo = {
      moveType: 'slide',
      indices: [1, 4],
    }
    const result = isValidMove(gameBoard, moveInfo)
    expect(result).to.be.equal(true)
    done()
  })

  it('should return false for an invalid slide move', (done) => {
    const gameBoard = new Array(24).fill(0)
    const moveInfo = {
      moveType: 'slide',
      indices: [0, 8],
    }
    const result = isValidMove(gameBoard, moveInfo)
    expect(result).to.be.equal(false)
    done()
  })
})

describe('Register the Game move', () => {
  it('should return updated gameboard (setup case)', (done) => {
    const gameBoard = new Array(24).fill(0)

    const expectedResult = new Array(24).fill(0)
    expectedResult[2] = 1

    const moveInfo = {
      moveType: 'setup',
      indices: [2],
    }
    const gameInfo = {
      boardState: gameBoard,
      turn: 1,
    }
    const result = registerMove(gameInfo, moveInfo)
    expect(result).to.deep.equal(expectedResult)
    done()
  })
  it('should return updated gameboard (slide case)', (done) => {
    const gameBoard = new Array(24).fill(0)
    gameBoard[2] = 1

    const expectedResult = new Array(24).fill(0)
    expectedResult[2] = 0
    expectedResult[4] = 1

    const moveInfo = {
      moveType: 'slide',
      indices: [2, 4],
    }
    const gameInfo = {
      boardState: gameBoard,
      turn: 1,
    }
    const result = registerMove(gameInfo, moveInfo)
    expect(result).to.deep.equal(expectedResult)
    done()
  })
})
