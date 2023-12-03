/* eslint-disable node/no-unsupported-features/es-syntax */
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const { v4: uuidv4 } = require('uuid')
const {
  isValidMove,
  registerMove,
  specialCase,
  getWinnerIfGameOver,
} = require('./game/index')

const httpServer = http.createServer()
const currentGames = new Map()
const playerTimers = new Map()

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


// const io = new Server(httpServer, {
//   cors: {
//     origin: ['http://localhost:5173', 'https://morris-game.surge.sh'],
//   },
// })

function startGameTimer(roomName, player) {
  let gameTimeInSeconds = playerTimers.get(roomName)[player].remainingTime

  const intervalId = setInterval(() => {
    gameTimeInSeconds -= 1
    io.to(roomName).emit(`game-time-update`, {
      player: player,
      timer: gameTimeInSeconds,
    })

    playerTimers.set(roomName, {
      ...playerTimers.get(roomName),
      [player]: {
        ...playerTimers.get(roomName)[player],
        remainingTime: gameTimeInSeconds,
      },
    })

    // Check for game over condition here if needed
    if (gameTimeInSeconds === 0) {
      clearInterval(playerTimers.get(roomName)[player].intervalId)
      io.to(roomName).emit('game-over', {
        winner: player === 'guest' ? 'host' : 'guest',
      })
    }
  }, 1000)

  // Save the intervalId for later use (clearing the interval)
  playerTimers.set(roomName, {
    ...playerTimers.get(roomName),
    [player]: { intervalId: intervalId, remainingTime: gameTimeInSeconds },
  })
}

/**
 * Handles the creation of a new game room.
 * @param {Object} socket - The Socket.IO socket of the client.
 * @param {Object} roomInfo - Information about the room being created.
 *   @param {string} roomInfo.user - The name of the room's host.
 *   @param {number} roomInfo.betAmount - The bet amount for the game.
 *   @param {number} roomInfo.gameTimer - The timeamount for the game in seconds.
 */
async function createRoom(socket, roomInfo) {
  const roomId = uuidv4().substring(0, 5).toUpperCase()
  const gameData = {
    host: roomInfo.user,
    betAmount: roomInfo.betAmount,
    gameTimer: roomInfo.gameTimer || 600,
    boardState: new Array(24).fill(0),
    turn: 'host',
    roomId: roomId,
  }
  currentGames.set(roomId, gameData)
  playerTimers.set(roomId, {
    host: { intervalId: null, remainingTime: gameData.gameTimer },
    guest: { intervalId: null, remainingTime: gameData.gameTimer },
  })

  socket.emit('room-created', roomId)
  socket.join(roomId)
}

/**
 * Handles a client's attempt to join an existing game room.
 * @param {Object} socket - The Socket.IO socket of the client.
 * @param {Object} roomInfo - Information about the room being joined.
 *   @param {string} roomInfo.user - The name of the client attempting to join.
 *   @param {string} roomInfo.roomName - The name of the room to join.
 */
async function joinRoom(socket, roomInfo) {
  const room = io.sockets.adapter.socketRooms[roomInfo.roomName]

  // TODO:we need to check this
  if (room && room.length > 1) {
    socket.emit(
      'room-join-failure',
      'Room does not exist or has reached full capacity.',
    )
    return
  }

  const gameData = currentGames.get(roomInfo.roomName)
  if (gameData) {
    gameData.guest = roomInfo.user
    socket.join(roomInfo.roomName)
    io.to(roomInfo.roomName).emit('room-joined', gameData)
  } else {
    socket.emit('room-join-failure', 'Room does not exist.')
  }
}

// think about logic of game over and how to handle that
async function gameMove(socket, gameInfo) {
  const game = currentGames.get(gameInfo.roomName)
  if (game) {
    if (!isValidMove(game, gameInfo.moveInfo)) {
      socket.emit(
        'illegal-move',
        'The move sent by client does not obey game rules!',
      )
      return
    }

    game.boardState = registerMove(game, gameInfo.moveInfo)
    // Game over check logic
    const winner = getWinnerIfGameOver(game)
    if (winner) {
      io.to(gameInfo.roomName).emit('game-over', {
        winner: winner,
      })
    }
    if (specialCase(game, gameInfo.moveInfo).length) {
      io.to(gameInfo.roomName).emit('move-registered', {
        ...game,
        special: true,
        indices: specialCase(game, gameInfo.moveInfo),
      })
      return
    }
    // change turns
    const currentPlayer = game.turn
    const otherPlayer = currentPlayer === 'host' ? 'guest' : 'host'
    clearInterval(playerTimers.get(gameInfo.roomName)[currentPlayer].intervalId)

    startGameTimer(gameInfo.roomName, otherPlayer)
    game.turn = game.turn === 'host' ? 'guest' : 'host'
    io.to(gameInfo.roomName).emit('move-registered', game)
  } else {
    socket.emit('game-error', 'No Such Game room exists')
  }
}

io.on('connection', (socket) => {
  socket.on('create-room', (roomInfo) => {
    createRoom(socket, roomInfo)
  })

  socket.on('join-room', (roomInfo) => {
    joinRoom(socket, roomInfo)
  })

  socket.on('game-move', (gameInfo) => {
    gameMove(socket, gameInfo)
  })
  socket.on('update-room', (gameInfo) => {
    const game = currentGames.get(gameInfo.roomName)
    if (game) {
      game.gameTimer = gameInfo.gameTimer || 15 * 60
      game.betAmount = gameInfo.betAmount || 0
    }
  })
  socket.on('get-room-info', (gameInfo) => {
    const game = currentGames.get(gameInfo.roomName)
    socket.emit('room-info', game)
  })
  socket.on('player-disconnect', (roomInfo) => {
    io.to(roomInfo.roomName).emit('player-disconnect', 'player-disconnect')
  })
})

httpServer.listen(process.env.PORT || 3001)
