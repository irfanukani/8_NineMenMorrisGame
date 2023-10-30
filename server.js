const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const { isValidMove, registerMove, specialCase } = require('./game/index');


const httpServer = http.createServer();

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://morris-game.surge.sh']
    },
});

const currentGames = new Map();


io.on('connection', (socket) => {

    socket.on('create-room', (roomInfo) => {
        createRoom(socket, roomInfo);
    });

    socket.on('join-room', (roomInfo) => {
        joinRoom(socket, roomInfo);
    });

    socket.on('game-move', (gameInfo) => {
        gameMove(socket, gameInfo);
    });
});

/**
 * Handles the creation of a new game room.
 * @param {Object} socket - The Socket.IO socket of the client.
 * @param {Object} roomInfo - Information about the room being created.
 *   @param {string} roomInfo.user - The name of the room's host.
 *   @param {number} roomInfo.betAmount - The bet amount for the game.
 *   @param {number} roomInfo.gameTimer - The timeamount for the game in seconds.
 */
async function createRoom(socket, roomInfo) {
    const roomId = uuidv4();
    const gameData = {
        host: roomInfo.user,
        betAmount: roomInfo.betAmount,
        gameTimer: roomInfo.gameTimer || 600,
        boardState: new Array(24).fill(0),
        turn: 'host',
        roomId: roomId
    };
    currentGames.set(roomId, gameData);

    socket.emit('room-created', roomId);
    socket.join(roomId);
}

/**
 * Handles a client's attempt to join an existing game room.
 * @param {Object} socket - The Socket.IO socket of the client.
 * @param {Object} roomInfo - Information about the room being joined.
 *   @param {string} roomInfo.user - The name of the client attempting to join.
 *   @param {string} roomInfo.roomName - The name of the room to join.
 */
async function joinRoom(socket, roomInfo) {
    const room = io.sockets.adapter.socketRooms[roomInfo.roomName];

    // TODO:we need to check this
    if (room && room.length > 1) {
        socket.emit('room-join-failure', 'Room does not exist or has reached full capacity.');
        return;
    }

    const gameData = currentGames.get(roomInfo.roomName);
    if (gameData) {
        gameData.guest = roomInfo.user;
        socket.join(roomInfo.roomName);
        // startGameTimer(roomInfo.roomName, gameData.gameTimer);
        io.to(roomInfo.roomName).emit('room-joined', gameData)
    } else {
        socket.emit('room-join-failure', 'Room does not exist.');
    }
}

// think about logic of game over and how to handle that
async function gameMove(socket, gameInfo) {
    const game = currentGames.get(gameInfo.roomName);
    if (game) {
        if (!isValidMove(game.boardState, gameInfo.moveInfo)) {
            socket.emit('illegal-move', 'The move sent by client does not obey game rules!');
            return;
        }
        game.boardState = registerMove(game, gameInfo.moveInfo);
        // Game over check logic
        if (specialCase(game, gameInfo.moveInfo).length) {
            io.to(gameInfo.roomName).emit('move-registered', { ...game, special: true, indices: specialCase(game, gameInfo.moveInfo) });
            return;
        }
        // change turns
        game.turn = game.turn === 'host' ? 'guest' : 'host';
        io.to(gameInfo.roomName).emit('move-registered', game);

    } else {
        socket.emit('game-error', 'No Such Game room exists');
    }
}

function startGameTimer(roomName, timeInSeconds) {
    let gameTimeInSeconds = timeInSeconds;

    gameTimer = setInterval(() => {
        gameTimeInSeconds--;
        io.to(roomName).emit('game-time-update', gameTimeInSeconds);
    }, 1000);
}

httpServer.listen(3001);
