const expect = require('chai').expect;
const io = require('socket.io-client');

const PORT = 3001;

describe('Socket.IO Connection', function () {
    let socket;

    before(function (done) {
        // Connect to the Socket.IO server before running the tests
        socket = io(`http://localhost:${PORT}`);
        socket.on('connect', () => {
            done();
        });
    });

    after(function (done) {
        // Disconnect the socket after all tests in this suite
        socket.disconnect();
        done();
    });

    it('should connect to the Socket.IO server', function () {
    });
});

describe('9-Man Morris Game', function () {
    let socket;
    let roomId;

    before(function (done) {
        socket = io(`http://localhost:${PORT}`);
        socket.on('connect', () => {
            done();
        });
    });

    after(function (done) {
        socket.disconnect();
        done();
    });

    it('should create a room and return the room ID', function (done) {
        socket.emit('create-room', { user: 'irfan', betAmount: 500 });
        socket.on('room-created', (uuid) => {
            roomId = uuid;
            expect(roomId).to.be.a('string');
            done();
        });
    });

    it('should join a room', function (done) {
        socket.emit('join-room', { roomName: roomId, user: 'anotherPlayer' });
        // Add assertions to verify the joining process here
        done();
    });
});